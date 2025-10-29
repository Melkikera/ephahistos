import { PrismaClient } from '@prisma/client';

export class PrismaRepository {
  protected prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }
}