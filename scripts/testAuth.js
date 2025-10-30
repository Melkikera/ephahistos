const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function tryAuth(email, password) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.log(`AUTH FAIL for ${email}: user not found`);
    return;
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (isValid) {
    console.log(`AUTH SUCCESS for ${email} (id=${user.id}, role=${user.role})`);
  } else {
    console.log(`AUTH FAIL for ${email}: invalid password`);
  }
}

async function main() {
  console.log('Running auth tests...');

  await tryAuth('test@example.com', 'Password123!'); // should succeed
  await tryAuth('test@example.com', 'BadPassword'); // should fail
  await tryAuth('bad@example.com', 'WrongPass1!'); // should succeed for this user
  await tryAuth('nonexistent@example.com', 'whatever'); // should fail (no user)

  console.log('Tests finished.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
