import { PrismaClient } from '@prisma/client';

// Use a global variable in development to avoid exhausting the database connection pool
// when HMR or server restarts occur. In production, create a new client normally.
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export const prisma: PrismaClient =
  global.__prisma ?? (global.__prisma = new PrismaClient());

export default prisma;
