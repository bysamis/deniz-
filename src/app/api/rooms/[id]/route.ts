import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const room = await prisma.room.findUnique({
    where: { id },
    include: {
      reservations: {
        orderBy: { checkIn: "desc" },
        include: { guest: true, companions: true },
      },
    },
  });

  if (!room) {
    return NextResponse.json({ error: "Oda bulunamadı." }, { status: 404 });
  }

  return NextResponse.json(room);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { name, type, capacity, notes } = body;

  const room = await prisma.room.update({
    where: { id },
    data: {
      ...(name !== undefined ? { name } : {}),
      ...(type !== undefined ? { type } : {}),
      ...(capacity !== undefined ? { capacity: Number(capacity) } : {}),
      ...(notes !== undefined ? { notes } : {}),
    },
  });

  return NextResponse.json(room);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.room.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
