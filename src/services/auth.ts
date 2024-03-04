import NextAuth from "next-auth";
import GitHub from "@auth/core/providers/github";
import {PrismaClient} from "@prisma/client";
import {PrismaAdapter} from "@auth/prisma-adapter";

const sharedPrismaClient = new PrismaClient();

export const {
  handlers: {GET, POST},
  auth
} = NextAuth({
  adapter: PrismaAdapter(sharedPrismaClient),
  providers: [GitHub],
});
