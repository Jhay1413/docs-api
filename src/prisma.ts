import { PrismaClient } from "@prisma/client";

// Prevent multiple instances of Prisma Client in development (hot reloading)

declare global {
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
