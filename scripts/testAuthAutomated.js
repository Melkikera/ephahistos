const assert = require('assert');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seed() {
  const password1 = 'Password123!';
  const password2 = 'WrongPass1!';

  const hashed1 = await bcrypt.hash(password1, 10);
  const hashed2 = await bcrypt.hash(password2, 10);

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
}

async function authorize(credentials) {
  // Reproduce the authorize logic from your NextAuth Credentials provider
  if (!credentials?.email || !credentials?.password) return null;
  const user = await prisma.user.findUnique({ where: { email: credentials.email } });
  if (!user) return null;
  const isValid = await bcrypt.compare(credentials.password, user.password);
  if (!isValid) return null;
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

async function jwtCallback({ token, user }) {
  if (user) {
    return { ...token, role: user.role, id: user.id };
  }
  return token;
}

async function sessionCallback({ session, token }) {
  if (session?.user && token?.role && token?.id) {
    session.user = { ...session.user, role: token.role, id: token.id };
  }
  return session;
}

async function runTests() {
  await seed();

  // 1) Successful auth for test@example.com
  const userOk = await authorize({ email: 'test@example.com', password: 'Password123!' });
  assert(userOk !== null, 'Expected authorize to return user for correct credentials');
  assert.strictEqual(userOk.email, 'test@example.com');

  // Simulate jwt callback
  const token = await jwtCallback({ token: {}, user: userOk });
  assert(token.role === userOk.role, 'JWT callback should set role');
  assert(token.id === userOk.id, 'JWT callback should set id');

  // Simulate session callback
  const session = await sessionCallback({ session: { user: { name: userOk.name, email: userOk.email } }, token });
  assert(session.user.role === token.role && session.user.id === token.id, 'Session callback should copy role and id');

  // 2) Fail auth with wrong password
  const userWrong = await authorize({ email: 'test@example.com', password: 'NotTheRightOne' });
  assert(userWrong === null, 'Expected authorize to return null for wrong password');

  // 3) Fail auth for nonexistent user
  const userMissing = await authorize({ email: 'nope@example.com', password: 'irrelevant' });
  assert(userMissing === null, 'Expected authorize to return null for nonexistent user');

  // 4) Successful auth for second seeded user
  const userBad = await authorize({ email: 'bad@example.com', password: 'WrongPass1!' });
  assert(userBad !== null && userBad.email === 'bad@example.com', 'Expected second user to authenticate');

  console.log('All automated auth tests passed');
}

runTests()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Automated auth tests FAILED:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
