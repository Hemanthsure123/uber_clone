// src/middlewares/auth.middleware.js
import { verifyToken } from "../utils/jwt.util.js";

export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(401);

  req.user = verifyToken(token);
  next();
};
