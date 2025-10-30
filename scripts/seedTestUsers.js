const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const password1 = 'Password123!';
  const password2 = 'WrongPass1!';

  const hashed1 = await bcrypt.hash(password1, 10);
  const hashed2 = await bcrypt.hash(password2, 10);

  console.log('Seeding users...');

  await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: { password: hashed1 },
    create: {
      name: 'Test User',
      email: 'test@example.com',
      password: hashed1,
      dateOfBirth: new Date('1990-01-01'),
      role: 'PARENT'
    }
  });

  await prisma.user.upsert({
    where: { email: 'bad@example.com' },
    update: { password: hashed2 },
    create: {
      name: 'Bad User',
      email: 'bad@example.com',
      password: hashed2,
      dateOfBirth: new Date('1995-01-01'),
      role: 'PARENT'
    }
  });

  console.log('Done.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
