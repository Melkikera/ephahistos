const assert = require('assert');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const TEST_EMAIL = process.env.TEST_RESET_EMAIL || 'reset-test@example.com';
const INITIAL_PASSWORD = process.env.TEST_RESET_INITIAL_PASSWORD || 'InitialPass123!';
const NEW_PASSWORD = process.env.TEST_RESET_NEW_PASSWORD || 'UpdatedPass123!';

async function seedUser() {
  const initialPasswordHash = await bcrypt.hash(INITIAL_PASSWORD, 10);

  await prisma.user.upsert({
    where: { email: TEST_EMAIL },
    update: {
      password: initialPasswordHash,
      resetPasswordToken: null,
      resetPasswordExpiresAt: null,
    },
    create: {
      name: 'Reset Test User',
      email: TEST_EMAIL,
      password: initialPasswordHash,
      dateOfBirth: new Date('1990-01-01'),
      role: 'PARENT',
    },
  });
}

async function run() {
  console.log(`Running password reset API test against ${BASE_URL}`);

  await seedUser();

  const forgotResponse = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-e2e-test': 'true',
    },
    body: JSON.stringify({ email: TEST_EMAIL }),
  });

  assert.strictEqual(forgotResponse.status, 200, 'forgot-password should return 200');

  const forgotPayload = await forgotResponse.json();
  assert(
    typeof forgotPayload.resetToken === 'string' && forgotPayload.resetToken.length > 0,
    'forgot-password should expose resetToken for explicit non-production e2e test calls',
  );

  const resetResponse = await fetch(`${BASE_URL}/api/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token: forgotPayload.resetToken,
      password: NEW_PASSWORD,
      confirmPassword: NEW_PASSWORD,
    }),
  });

  assert.strictEqual(resetResponse.status, 200, 'reset-password should return 200');

  const updatedUser = await prisma.user.findUnique({ where: { email: TEST_EMAIL } });
  assert(updatedUser, 'test user should exist after reset');

  const isPasswordUpdated = await bcrypt.compare(NEW_PASSWORD, updatedUser.password);
  assert(isPasswordUpdated, 'password hash should match the new password');
  assert.strictEqual(updatedUser.resetPasswordToken, null, 'reset token should be cleared');
  assert.strictEqual(updatedUser.resetPasswordExpiresAt, null, 'reset token expiry should be cleared');

  console.log('Password reset automated API test passed');
}

run()
  .catch((error) => {
    console.error('Password reset automated API test FAILED:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
