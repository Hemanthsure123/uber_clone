// src/seeds/admin.seed.js
import User from "../modules/users/user.model.js";
import { hashPassword } from "../utils/password.util.js";

await User.create({
  email: "admin@platform.com",
  passwordHash: await hashPassword("Admin@123"),
  role: "ADMIN",
  emailVerified: true
});
