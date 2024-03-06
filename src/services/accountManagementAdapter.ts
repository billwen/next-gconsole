import {PrismaClient, User} from "@prisma/client";
import {PrismaAdapter} from "@auth/prisma-adapter";
import {Adapter, AdapterUser} from "@auth/core/adapters";
import {DataService} from "@/services/db";
import {Awaitable} from "@auth/core/types";

export default function AccountManagementAdapter(usingDataService: DataService): Adapter {
  const sharedPrismaClient = new PrismaClient();
  const adapter = PrismaAdapter(sharedPrismaClient);

  const ds = usingDataService;

  return {
    ...adapter,
    createUser(user: AdapterUser) {
      console.log("Creating user", {user});
      return ds.createDefaultUser(user as User) as Awaitable<AdapterUser>;
    }
  };
};
