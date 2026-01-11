// src/config/mail.js
import { SMTPClient } from "smtp-client";
import env from "./env.js";

export const createSmtpClient = async () => {
  const client = new SMTPClient({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: false, // STARTTLS
    timeout: 10000
  });

  await client.connect();
  await client.greet({ hostname: "localhost" });

  await client.authPlain({
    username: env.smtp.user,
    password: env.smtp.pass
  });

  return client;
};
