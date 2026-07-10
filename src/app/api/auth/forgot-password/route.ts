import { randomBytes, createHash } from 'crypto';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/services/email';

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

const RESET_TOKEN_TTL_MS = 1000 * 60 * 60;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = forgotPasswordSchema.parse(body);

    const user = await prisma.user.findUnique({ where: { email: parsed.email } });

    let rawTokenForTest: string | null = null;

    if (user) {
      const rawToken = randomBytes(32).toString('hex');
      const hashedToken = createHash('sha256').update(rawToken).digest('hex');
      const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);

      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetPasswordToken: hashedToken,
          resetPasswordExpiresAt: expiresAt,
        },
      });

      const baseUrl = process.env.NEXTAUTH_URL ?? new URL(req.url).origin;
      const resetUrl = `${baseUrl}/reset-password?token=${rawToken}`;
      rawTokenForTest = rawToken;

      const delivery = await sendPasswordResetEmail({
        to: user.email,
        resetUrl,
      });

      if (!delivery.delivered) {
        // Keep a safe fallback for local/dev environments.
        console.warn(
          `Password reset email not sent to ${user.email}: ${delivery.reason}. Link: ${resetUrl}`,
        );
      }
    }

    const responseBody: {
      message: string;
      resetToken?: string;
    } = {
      message:
        'If an account exists for this email, a password reset link has been generated.',
    };

    const exposeForTest =
      process.env.NODE_ENV !== 'production' && req.headers.get('x-e2e-test') === 'true';

    if (exposeForTest && rawTokenForTest) {
      responseBody.resetToken = rawTokenForTest;
    }

    return NextResponse.json(responseBody, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid input data', errors: error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
