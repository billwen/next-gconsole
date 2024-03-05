import {PrismaClient} from "@prisma/client";
import bcrypt from "bcryptjs";

/**
 * Role table
 */
const builtInRoles = [
  {
    id: 1,
    name: "sysadmin",
    displayName: "System admin",
    description: "Admin role for whole system",
    builtIn: true
  }, {
    id: 2,
    name: "user",
    displayName: "User",
    description: "User role for the system, can only login",
    builtIn: true
  }
];

const prisma = new PrismaClient();

const seedData = async (prisma: PrismaClient) => {

  // Added role data
  await prisma.role.createMany({
    data: builtInRoles
  });

  // Create system admin
  const salt = await bcrypt.genSalt();
  const password = await bcrypt.hash("admin", salt);
  await prisma.user.create({
    data: {
      username: "admin",
      builtIn: true,
      givenName: "System",
      familyName: "Admin",
      password,
      salt,
      email: "admin@localhost",
      emailVerified: new Date(),
      enabled: true,
      expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 365 * 1000),
      passwordExpires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 365 * 1000),
      roles: {
        create: {
          assignedByUsername: "admin",
          role: {
            connect: {
              id: 1
            }
          }
        }
      }
    }
  });

};

seedData(prisma)
  .then(async () => {
    console.log("Seed data complete");
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });