import env from "../config/env.js";
import { createSmtpClient } from "../config/mail.js";

/**
 * Send OTP email using Gmail SMTP
 * No Nodemailer
 * Single Responsibility: send email only
 */
export const sendEmail = async (to, otp) => {
  if (!to || !otp) {
    throw new Error("Email recipient or OTP missing");
  }

  const client = await createSmtpClient();

  try {
    await client.mail({ from: env.smtp.user });
    await client.rcpt({ to });

    await client.data(
`From: Uber Clone <${env.smtp.user}>
To: ${to}
Subject: Your OTP Code

Your OTP is: ${otp}

This OTP will expire in 5 minutes.
Do not share this code with anyone.

If you did not request this OTP, please ignore this email.
`
    );

    await client.quit();

  } catch (err) {
    console.error("Email send failed:", err.message);
    try {
      await client.quit();
    } catch (_) {}
    throw new Error("Failed to send OTP email");
  }
};
