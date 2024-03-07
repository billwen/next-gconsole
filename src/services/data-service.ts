import {Permission, PrismaClient, User} from "@prisma/client";

const buildUserPermissions = async (fromDb: PrismaClient) => {
  console.log('Building up auth');
  const allUsers = await fromDb.user.findMany({
    include: {
      roles: true
    }
  });

  const allRoles = await fromDb.role.findMany({
    include: {
      permissions: true
    }
  });

  const allPermissions = await fromDb.permission.findMany();

  const userPermissions: Record<string, Permission[]> = {};
  allUsers.forEach(u => {

    const roles = u.roles.map(ur => {
      return allRoles.filter((e) => e.id === ur.id);
    }).flat();

    const permissions: Permission[] = [];

    while (roles.length > 0) {
      const r = roles.shift();

      if (r) {
        // Find all children
        const rs = allRoles.filter(e => e.parentId === r.id);
        const ps = r.permissions.flatMap(p => allPermissions.filter(e => e.id === p.permissionId));
        roles.push(...rs);

        if (ps.length > 0) {
          permissions.push(...ps);
        }
      }
    }

    userPermissions[u.username] = permissions;
  });

  return userPermissions;
};

declare global {
  var ds: DataService | undefined;
}

export type DataService = ReturnType<typeof createDataService>;

const createDataService = () => {
  const db = new PrismaClient();
  let userPermissions: Record<string, Permission[]> | undefined = undefined;
  /**
   * Create a default user with a basic role which allows login only
   * @param {User} withProfile - The user profile
   * @param {string} by - The username of the user who creates this user
   */
  const createDefaultUser = async (withProfile: User, by: string = "admin") => {
    // Create a user with default user role
    return db.user.create({
      data: {
        ...withProfile,
        roles: {
          create: {
            assignedByUsername: by,
            role: {
              connect: {
                id: 2
              }
            }
          }
        }
      }
    });
  };

  const getUserPermissions = async () => {
    if (!userPermissions) {
      userPermissions = await buildUserPermissions(db);
    }

    return userPermissions;
  };

  return {
    db,
    getUserPermissions,
    createDefaultUser
  };
};

export const ds = global.ds || createDataService();

//
// https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-dev-practices
//
if (process.env.NODE_ENV !== "production") {
  globalThis.ds = ds;
}
