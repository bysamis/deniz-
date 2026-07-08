import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Reservation } from "@prisma/client";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const roomId = searchParams.get("roomId");

  const where: any = {};
  if (roomId) where.roomId = roomId;
  if (from || to) {
    where.AND = [];
    if (from) where.AND.push({ checkOut: { gte: new Date(from) } });
    if (to) where.AND.push({ checkIn: { lte: new Date(to) } });
  }

  const reservations = await prisma.reservation.findMany({
    where,
    orderBy: { checkIn: "asc" },
    include: { guest: true, room: true, companions: true },
  });

  return NextResponse.json(reservations);
}

function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
  return aStart < bEnd && bStart < aEnd;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      roomId,
      checkIn,
      checkOut,
      guestCount,
      notes,
      guestId,
      guestFullName,
      guestPhone,
      guestEmail,
      guestIdNumber,
      companions,
      kvkkConsent,
    } = body;

    if (!roomId || !checkIn || !checkOut) {
      return NextResponse.json(
        { error: "Oda, giriş ve çıkış tarihi gerekli." },
        { status: 400 }
      );
    }

    if (!kvkkConsent) {
      return NextResponse.json(
        { error: "KVKK Aydınlatma Metni onayı olmadan rezervasyon oluşturulamaz." },
        { status: 400 }
      );
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkOutDate <= checkInDate) {
      return NextResponse.json(
        { error: "Çıkış tarihi giriş tarihinden sonra olmalı." },
        { status: 400 }
      );
    }

    // Overlap check
    const existing = await prisma.reservation.findMany({
      where: { roomId, status: { not: "cancelled" } },
    });
    const clash = existing.find((r: Reservation) =>
      overlaps(checkInDate, checkOutDate, r.checkIn, r.checkOut)
    );
    if (clash) {
      return NextResponse.json(
        {
          error:
            "Bu oda seçilen tarih aralığında dolu. Lütfen başka bir tarih veya oda seçin.",
        },
        { status: 409 }
      );
    }

    let finalGuestId = guestId;
    if (!finalGuestId) {
      if (!guestFullName) {
        return NextResponse.json(
          { error: "Misafir adı gerekli." },
          { status: 400 }
        );
      }
      const guest = await prisma.guest.create({
        data: {
          fullName: guestFullName,
          phone: guestPhone || null,
          email: guestEmail || null,
          idNumber: guestIdNumber || null,
        },
      });
      finalGuestId = guest.id;
    }

    const validCompanions = Array.isArray(companions)
      ? companions
          .filter((c: any) => c && typeof c.fullName === "string" && c.fullName.trim())
          .map((c: any) => ({
            fullName: c.fullName.trim(),
            idNumber: c.idNumber ? String(c.idNumber).trim() : null,
          }))
      : [];

    const reservation = await prisma.reservation.create({
      data: {
        roomId,
        guestId: finalGuestId,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guestCount: guestCount ? Number(guestCount) : 1,
        notes: notes || null,
        kvkkConsent: true,
        companions:
          validCompanions.length > 0
            ? { create: validCompanions }
            : undefined,
      },
      include: { guest: true, room: true, companions: true },
    });

    return NextResponse.json(reservation, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Rezervasyon oluşturulamadı." },
      { status: 500 }
    );
  }
}
