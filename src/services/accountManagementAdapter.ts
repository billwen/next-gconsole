import {PrismaClient} from "@prisma/client";
import {PrismaAdapter} from "@auth/prisma-adapter";
import {Adapter, AdapterUser} from "@auth/core/adapters";

export default function AccountManagementAdapter(): Adapter {
  const sharedPrismaClient = new PrismaClient();
  const adapter = PrismaAdapter(sharedPrismaClient);

  return {
    ...adapter,
    async createUser(user: AdapterUser) {
      console.log("Creating user", {user});
      if (adapter && adapter.createUser) {
        return await adapter.createUser(user);
      }

      throw new Error("Adapter not initialized");
    }
  };
};
