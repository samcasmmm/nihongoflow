import { config } from "@/core/config";

export interface SendEmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export async function sendEmail({ to, subject, text, html }: SendEmailOptions): Promise<boolean> {
  // If Resend API key is provided, use Resend HTTP API
  if (config.email.resendApiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.email.resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: config.email.from,
          to,
          subject,
          text,
          html: html || text,
        }),
      });
      return res.ok;
    } catch (err) {
      console.error("[Email Error via Resend]:", err);
    }
  }

  // Fallback: In development or when no provider configured, log clearly to console
  console.log("-----------------------------------------");
  console.log(`[EMAIL DISPATCH] To: ${to}`);
  console.log(`[SUBJECT]: ${subject}`);
  console.log(`[CONTENT]:\n${text}`);
  console.log("-----------------------------------------");
  return true;
}

export async function sendVerificationEmail(email: string, token: string): Promise<boolean> {
  const verifyUrl = `${config.app.url}/verify?token=${token}`;
  const subject = "Verify your NihongoFlow account";
  const text = `Welcome to NihongoFlow! Please verify your email by clicking the link below:\n\n${verifyUrl}\n\nThis link will expire in 24 hours.`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #0f172a;">Welcome to NihongoFlow!</h2>
      <p style="color: #334155; font-size: 16px;">
        Please confirm your email address to begin your Japanese learning journey.
      </p>
      <div style="margin: 30px 0;">
        <a href="${verifyUrl}" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600;">
          Verify Email
        </a>
      </div>
      <p style="color: #64748b; font-size: 14px;">
        Or copy and paste this link in your browser:<br/>
        <a href="${verifyUrl}">${verifyUrl}</a>
      </p>
      <p style="color: #94a3b8; font-size: 12px; margin-top: 30px;">
        If you did not create an account, you can safely ignore this email.
      </p>
    </div>
  `;
  return sendEmail({ to: email, subject, text, html });
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
  const resetUrl = `${config.app.url}/reset?token=${token}`;
  const subject = "Reset your NihongoFlow password";
  const text = `You requested a password reset for NihongoFlow.\n\nClick the link below to set a new password:\n\n${resetUrl}\n\nThis link will expire in 1 hour. If you didn't request this, ignore this email.`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #0f172a;">Password Reset Request</h2>
      <p style="color: #334155; font-size: 16px;">
        We received a request to reset your NihongoFlow password.
      </p>
      <div style="margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600;">
          Reset Password
        </a>
      </div>
      <p style="color: #64748b; font-size: 14px;">
        Or copy and paste this link in your browser:<br/>
        <a href="${resetUrl}">${resetUrl}</a>
      </p>
      <p style="color: #94a3b8; font-size: 12px; margin-top: 30px;">
        If you did not request this reset, please ignore this email.
      </p>
    </div>
  `;
  return sendEmail({ to: email, subject, text, html });
}
