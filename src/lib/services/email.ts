type PasswordResetEmailInput = {
  to: string;
  resetUrl: string;
};

const RESEND_API_URL = 'https://api.resend.com/emails';

export async function sendPasswordResetEmail({
  to,
  resetUrl,
}: PasswordResetEmailInput): Promise<{ delivered: boolean; providerId?: string; reason?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESET_FROM_EMAIL;

  if (!apiKey || !from) {
    return {
      delivered: false,
      reason: 'Missing RESEND_API_KEY or RESET_FROM_EMAIL',
    };
  }

  const response = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: 'Password reset',
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.5;max-width:560px;">
          <h2 style="margin-bottom:16px;">Password reset request</h2>
          <p>You requested to reset your password.</p>
          <p>
            <a href="${resetUrl}" style="display:inline-block;padding:10px 16px;background:#4f46e5;color:#fff;text-decoration:none;border-radius:6px;">
              Reset my password
            </a>
          </p>
          <p>If you did not request this, you can ignore this email.</p>
          <p>This link expires in 1 hour.</p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const bodyText = await response.text();
    return {
      delivered: false,
      reason: `Resend error ${response.status}: ${bodyText}`,
    };
  }

  const payload = (await response.json()) as { id?: string };

  return {
    delivered: true,
    providerId: payload.id,
  };
}
