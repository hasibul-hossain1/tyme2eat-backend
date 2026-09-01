import config from "../config/index.js";
import { Role } from "../generated/prisma/enums.js";
import { prisma } from "../lib/prisma.js";

export async function seedAdmin() {
  const admin = {
    name: "Admin",
    email: config.default_admin_email!,
    password: config.default_admin_password!,
    role: Role.ADMIN,
  };

  const existingAdmin = await prisma.user.findUnique({
    where: { email: admin.email },
    select: { id: true},
  });

  if (!existingAdmin) {
    console.log("Default admin not found, creating...");
    const createAdmin = await prisma.user.create({
      data: admin,
    });
    if (!createAdmin.id) throw new Error("Failed to create admin");

    console.log("Default admin created successfully");
  } else {
    // console.log("Default admin already exists and verified");
  }
}
