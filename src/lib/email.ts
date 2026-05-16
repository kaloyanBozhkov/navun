import { env } from "@/env";
import { resend } from "@/lib/resend";

export async function sendMagicLinkEmail(email: string, url: string) {
  if (!resend) {
    console.error("Resend not configured — magic link not sent via email");
    return;
  }

  await resend.emails.send({
    from: env.EMAIL_FROM,
    to: email,
    subject: "Sign in to Навън",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2>Sign in to Навън</h2>
        <p>Click the button below to sign in to your account.</p>
        <a href="${url}" style="display: inline-block; padding: 12px 24px; background: #111; color: #fff; text-decoration: none; border-radius: 6px;">
          Sign In
        </a>
        <p style="margin-top: 16px; color: #666; font-size: 14px;">
          If you didn't request this email, you can safely ignore it.
        </p>
        <p style="margin-top: 8px; color: #999; font-size: 12px; word-break: break-all;">${url}</p>
      </div>
    `,
  });
}
