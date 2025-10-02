import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error("❌ ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env");
  }

  // Check if admin exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log(`⚠️ Admin (${adminEmail}) already exists. Skipping creation.`);
    return;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  // Create admin user
  const adminUser = await prisma.user.create({
    data: {
      name: "tanveer",
      email: adminEmail,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("✅ Seeded admin user:");
  console.log("   email:", adminUser.email);
  console.log("   password: (from .env ADMIN_PASSWORD, stored as hashed)");
}

main()
  .catch((err) => {
    console.error("❌ Error seeding admin:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
