import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";

export async function GET() {
  try {
    const count = await prisma.user.count();
    return NextResponse.json({ hasUsers: count > 0 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Veritabanına bağlanılamadı. DATABASE_URL ayarını kontrol edin." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const count = await prisma.user.count();
    if (count > 0) {
      return NextResponse.json(
        { error: "Zaten bir yönetici hesabı var. Giriş sayfasını kullanın." },
        { status: 403 }
      );
    }

    const { username, password, name } = await req.json();

    if (!username || !password || password.length < 6) {
      return NextResponse.json(
        {
          error:
            "Kullanıcı adı ve en az 6 karakterli bir şifre gerekli.",
        },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, password: hashed, name: name || username },
    });

    await createSession({
      userId: user.id,
      username: user.username,
      name: user.name,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Hesap oluşturulamadı." },
      { status: 500 }
    );
  }
}
