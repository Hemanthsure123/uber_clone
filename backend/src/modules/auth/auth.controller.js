import User from "../users/user.model.js";
import Driver from "../drivers/driver.model.js";
import Otp from "./otp.model.js";
import { sendEmail } from "../../utils/email.util.js";

import { hashPassword, comparePassword } from "../../utils/password.util.js";
import { generateOtp, hashOtp } from "../../utils/otp.util.js";
import { signToken } from "../../utils/jwt.util.js";

/**
 * ============================
 * SIGNUP (USER / DRIVER)
 * ============================
 */
export const signup = async (req, res) => {
  try {
    const { email, password, role, driverDetails } = req.body;

    // 1. Basic validation
    if (!email || !password || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!["USER", "DRIVER"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    // 2. Check duplicate user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered" });
    }

    // 3. Hash password
    const passwordHash = await hashPassword(password);

    // 4. Create user
    const user = await User.create({
      email,
      passwordHash,
      role,
      emailVerified: false
    });

    // 5. If DRIVER → create driver profile
    if (role === "DRIVER") {
      if (!driverDetails) {
        return res.status(400).json({ error: "Driver details required" });
      }

      await Driver.create({
        userId: user._id,
        fullName: driverDetails.fullName,
        phone: driverDetails.phone,
        vehicleType: driverDetails.vehicleType,
        vehicleNumber: driverDetails.vehicleNumber,
        city: driverDetails.city,
        status: "PENDING"
      });
    }

    // 6. Generate OTP
    const otp = generateOtp();

    // Remove old OTPs if any
    await Otp.deleteMany({ userId: user._id });

    await Otp.create({
      userId: user._id,
      otpHash: hashOtp(otp),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      attempts: 0
    });

    await sendEmail(email, otp);

    return res.status(201).json({
      message: "Signup successful. OTP sent to email."
    });

  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ error: "Signup failed" });
  }
};

/**
 * ============================
 * VERIFY EMAIL OTP
 * ============================
 */
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP required" });
    }

    // 1. Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // 2. Find OTP record
    const record = await Otp.findOne({ userId: user._id });
    if (!record) {
      return res.status(400).json({ error: "OTP not found" });
    }

    // 3. Check expiry
    if (record.expiresAt < Date.now()) {
      await record.deleteOne();
      return res.status(400).json({ error: "OTP expired" });
    }

    // 4. Validate OTP
    if (hashOtp(otp) !== record.otpHash) {
      record.attempts += 1;
      await record.save();

      if (record.attempts >= 3) {
        await record.deleteOne();
        return res.status(400).json({ error: "OTP attempts exceeded" });
      }

      return res.status(400).json({ error: "Invalid OTP" });
    }

    // 5. Mark email verified
    user.emailVerified = true;
    await user.save();

    // 6. Cleanup OTP
    await record.deleteOne();

    return res.json({ message: "Email verified successfully" });

  } catch (err) {
    console.error("Verify OTP error:", err);
    return res.status(500).json({ error: "OTP verification failed" });
  }
};

/**
 * ============================
 * LOGIN
 * ============================
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    // 2. Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 3. Check email verification
    if (!user.emailVerified) {
      return res.status(401).json({ error: "Email not verified" });
    }

    // 4. Validate password
    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 5. Issue JWT
    const token = signToken({
      sub: user._id,
      role: user.role
    });

    return res.json({
      message: "Login successful",
      token
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Login failed" });
  }
};
