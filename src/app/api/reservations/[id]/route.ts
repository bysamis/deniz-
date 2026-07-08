import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Reservation } from "@prisma/client";

function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
  return aStart < bEnd && bStart < aEnd;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { checkIn, checkOut, guestCount, notes, status } = body;

  const current = await prisma.reservation.findUnique({ where: { id } });
  if (!current) {
    return NextResponse.json({ error: "Rezervasyon bulunamadı." }, { status: 404 });
  }

  const newCheckIn = checkIn ? new Date(checkIn) : current.checkIn;
  const newCheckOut = checkOut ? new Date(checkOut) : current.checkOut;

  if (checkIn || checkOut) {
    if (newCheckOut <= newCheckIn) {
      return NextResponse.json(
        { error: "Çıkış tarihi giriş tarihinden sonra olmalı." },
        { status: 400 }
      );
    }
    const others = await prisma.reservation.findMany({
      where: {
        roomId: current.roomId,
        status: { not: "cancelled" },
        id: { not: id },
      },
    });
    const clash = others.find((r: Reservation) =>
      overlaps(newCheckIn, newCheckOut, r.checkIn, r.checkOut)
    );
    if (clash) {
      return NextResponse.json(
        { error: "Bu oda seçilen tarih aralığında dolu." },
        { status: 409 }
      );
    }
  }

  const reservation = await prisma.reservation.update({
    where: { id },
    data: {
      checkIn: newCheckIn,
      checkOut: newCheckOut,
      ...(guestCount !== undefined ? { guestCount: Number(guestCount) } : {}),
      ...(notes !== undefined ? { notes } : {}),
      ...(status !== undefined ? { status } : {}),
    },
    include: { guest: true, room: true },
  });

  return NextResponse.json(reservation);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.reservation.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
