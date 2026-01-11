import express from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import { uploadSelfie } from "./driver.controller.js";

const router = express.Router();

/**
 * ============================
 * DRIVER – UPLOAD SELFIE
 * ============================
 * Flow:
 *  - Driver must be logged in
 *  - Driver uploads selfie URL (Cloudinary)
 *  - Backend sends OTP
 */
router.post(
  "/upload-selfie",
  authenticate,
  (req, res, next) => {
    if (req.user.type !== "ONBOARDING") {
      return res.status(403).json({ error: "Invalid token type" });
    }
    next();
  },
  uploadSelfie
);

export default router;
