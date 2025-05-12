import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

async function main() {
  const hashedPassword = await bcrypt.hash("1mdpadmin1", 10);

  await prisma.admin.create({
    data: {
      email: "admin@admin.com",
      password: hashedPassword,
    },
  });

  console.log("Admin created!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });