import {PrismaClient, User} from "@prisma/client";
import {AdapterUser} from "@auth/core/adapters";

declare global {
  var ds: DataService | undefined;
}

export type DataService = ReturnType<typeof createDataService>;

const createDataService = () => {
  const db = new PrismaClient();

  /**
   * Create a default user with a basic role which allows login only
   * @param {User} withProfile - The user profile
   * @param {string} by - The username of the user who creates this user
   */
  const createDefaultUser = async (withProfile: User, by: string = "admin") => {
    // Create a user with one role
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

  return {
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
