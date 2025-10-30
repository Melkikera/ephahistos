const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning up test users...');
  await prisma.user.deleteMany({ where: { email: { in: ['test@example.com', 'bad@example.com'] } } });
  console.log('Cleanup done.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
