import bcrypt from "bcryptjs";

import {Prisma, PrismaClient} from "@prisma/client";
import PermissionUncheckedCreateInput = Prisma.PermissionUncheckedCreateInput;
import RoleCreateInput = Prisma.RoleCreateInput;
import RoleUncheckedCreateInput = Prisma.RoleUncheckedCreateInput;
import RolePermissionUncheckedCreateNestedManyWithoutRoleInput = Prisma.RolePermissionUncheckedCreateNestedManyWithoutRoleInput;


/**
 * Permission table
 */
const builtInPermissions: PermissionUncheckedCreateInput[] = [
  {
    id: 1,
    slug: "system.login.admin",
    module: "system",
    feature: "login",
    name: "admin",
    description: "system admin role",
  },
  {
    id: 2,
    slug: "system.login.user",
    module: "system",
    feature: "login",
    name: "user",
    description: "system user role, which can only login",
  }
];

/**
 * Role table
 */
type BuiltInRole = RoleUncheckedCreateInput & {
  permissionsIds: number[];
};

const builtInRoles: BuiltInRole[] = [
  {
    id: 1,
    slug: "sysadmin",
    name: "System admin",
    description: "Admin role for whole system",
    builtIn: true,
    permissionsIds: [1, 2]
  }, {
    id: 2,
    slug: "sysuser",
    name: "User",
    description: "User role for the system, can only login",
    builtIn: true,
    permissionsIds: [2]
  }
];

const prisma = new PrismaClient();

const seedData = async (prisma: PrismaClient) => {

  // Added permission data
  let p = builtInPermissions.map(async (permission) => {
    await prisma.permission.create({
      data: {
        ...permission
      }
    });

  });
  let result = await Promise.allSettled(p);
  result.forEach(r => {
    if (r.status === 'rejected') {
      console.log(`Apply seed failed.`)
      throw new Error(`Creating permission table failed, reason ${r.reason}`)
    }
  });

  // Create roles based on permissions
  const p2 = builtInRoles.map(async (role) => {
    const {permissionsIds, ...roleData} = role as BuiltInRole;
    const ps: any[] = [];
    permissionsIds.forEach((id) => {
      const newPermission = {
        permission: {
          connect: {
            id
          }
        }
      };
      ps.push(newPermission);
    });

    await prisma.role.create({
      data: {
        ...roleData,
        permissions: {
          create: ps
        } as RolePermissionUncheckedCreateNestedManyWithoutRoleInput
      }
    });
  });

  await Promise.all(p2);

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

  // Done
};

(async () => {
  let retCode = 0;

  try {
    await seedData(prisma);
    console.log("Seed data complete");
  } catch (e) {
    console.error(e);
    retCode = 1;
  } finally {
    await prisma.$disconnect();
  }

  process.exit(retCode);
})();

