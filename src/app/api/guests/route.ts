import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  const guests = await prisma.guest.findMany({
    where: q
      ? {
          OR: [
            { fullName: { contains: q, mode: "insensitive" } },
            { phone: { contains: q } },
          ],
        }
      : undefined,
    orderBy: { fullName: "asc" },
    take: q ? 15 : 200,
    include: {
      _count: { select: { reservations: true } },
      reservations: {
        orderBy: { checkIn: "desc" },
        include: { room: true },
      },
    },
  });

  return NextResponse.json(guests);
}
