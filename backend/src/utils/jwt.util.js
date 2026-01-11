// src/utils/jwt.util.js
import jwt from "jsonwebtoken";

export const signToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30m" });

export const verifyToken = (token) =>
  jwt.verify(token, process.env.JWT_SECRET);
