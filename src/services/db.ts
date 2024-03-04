import {PrismaClient} from "@prisma/client";

declare global {
  var db: PrismaClient | undefined;
}

export const db = globalThis.db || new PrismaClient();

// hot reload prisma client
// If we're in development, let's make sure we can access the prisma client from the console
// This is useful for debugging
if (process.env.NODE_ENV !== "production") {
  globalThis.db = db;
}
