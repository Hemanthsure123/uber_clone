// src/modules/users/user.model.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["USER", "DRIVER", "ADMIN"], required: true },
  emailVerified: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("User", userSchema);