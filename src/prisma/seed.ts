import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env");
  }

  const existing = await prisma.user.findUnique({
    where: { email: adminEmail },
  });
  if (existing) {
    console.log(`Admin (${adminEmail}) already exists. Skipping creation.`);
    return;
  }

  const salt = await bcryptjs.genSalt(10);
  const hashed = await bcryptjs.hash(adminPassword, salt);

  const user = await prisma.user.create({
    data: {
      email: adminEmail,
      password: hashed,
      role: "ADMIN",
      name: "Portfolio Owner",
    },
  });

  console.log("Seeded admin user:");
  console.log("  email:", user.email);
  console.log("  password:", "(the value from your .env ADMIN_PASSWORD)");
  console.log("  note: password stored hashed in DB.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
