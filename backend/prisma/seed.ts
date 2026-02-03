import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { email: "admin@library.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@library.com",
      password,
      role: "ADMIN", // 👈 use string
    },
  });

  console.log("✅ Admin user created");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
