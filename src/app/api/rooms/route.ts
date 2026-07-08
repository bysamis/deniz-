import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Reservation, Guest, Room } from "@prisma/client";

type ReservationWithGuest = Reservation & { guest: Guest };
type RoomWithReservations = Room & { reservations: ReservationWithGuest[] };

export async function GET() {
  const rooms = await prisma.room.findMany({
    orderBy: { name: "asc" },
    include: {
      reservations: {
        where: { status: { not: "cancelled" } },
        orderBy: { checkIn: "desc" },
        include: { guest: true },
      },
    },
  });

  const now = new Date();

  const roomsWithStatus = rooms.map((room: RoomWithReservations) => {
    const current = room.reservations.find(
      (r: ReservationWithGuest) => r.checkIn <= now && r.checkOut > now
    );
    const upcoming = room.reservations
      .filter((r: ReservationWithGuest) => r.checkIn > now)
      .sort(
        (a: ReservationWithGuest, b: ReservationWithGuest) =>
          a.checkIn.getTime() - b.checkIn.getTime()
      )[0];

    return {
      id: room.id,
      name: room.name,
      type: room.type,
      capacity: room.capacity,
      notes: room.notes,
      status: current ? "occupied" : "empty",
      currentGuest: current
        ? {
            reservationId: current.id,
            name: current.guest.fullName,
            phone: current.guest.phone,
            checkIn: current.checkIn,
            checkOut: current.checkOut,
            guestCount: current.guestCount,
          }
        : null,
      nextReservation: upcoming
        ? {
            reservationId: upcoming.id,
            name: upcoming.guest.fullName,
            checkIn: upcoming.checkIn,
            checkOut: upcoming.checkOut,
          }
        : null,
      totalStays: room.reservations.length,
    };
  });

  return NextResponse.json(roomsWithStatus);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, type, capacity, notes } = body;

    if (!name) {
      return NextResponse.json({ error: "Oda adı gerekli." }, { status: 400 });
    }

    const room = await prisma.room.create({
      data: {
        name,
        type: type || "Standart",
        capacity: capacity ? Number(capacity) : 2,
        notes: notes || null,
      },
    });

    return NextResponse.json(room, { status: 201 });
  } catch (err: any) {
    if (err?.code === "P2002") {
      return NextResponse.json(
        { error: "Bu isimde bir oda zaten var." },
        { status: 409 }
      );
    }
    console.error(err);
    return NextResponse.json({ error: "Oda oluşturulamadı." }, { status: 500 });
  }
}
