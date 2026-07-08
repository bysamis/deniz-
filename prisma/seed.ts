import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const username = process.env.SEED_ADMIN_USERNAME || "admin";
  const password = process.env.SEED_ADMIN_PASSWORD || "degistir123";
  const name = process.env.SEED_ADMIN_NAME || "Yönetici";

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    console.log(`Kullanıcı "${username}" zaten var, atlanıyor.`);
  } else {
    const hashed = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: { username, password: hashed, name },
    });
    console.log(`Yönetici kullanıcı oluşturuldu -> kullanıcı adı: ${username}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
