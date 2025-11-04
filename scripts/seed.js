const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  const email = 'test@example.com';
  const password = 'Password123!';
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.log('USER_NOT_FOUND');
    await prisma.$disconnect();
    return;
  }
  const ok = await bcrypt.compare(password, user.password);
  console.log('user.id=', user.id, 'ok=', ok);
  await prisma.$disconnect();
}

test().catch(e=>{ console.error(e); process.exit(1); });