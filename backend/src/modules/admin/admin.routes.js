import express from "express";
import Driver from "../drivers/driver.model.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";

const router = express.Router();

/**
 * ============================
 * ADMIN – APPROVE DRIVER
 * ============================
 */
router.patch(
  "/driver/:driverId/approve",
  authenticate,           // 1️⃣ Who are you?
  authorize("ADMIN"),     // 2️⃣ Are you admin?
  async (req, res) => {
    const { driverId } = req.params;

    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(404).json({ error: "Driver not found" });
    }

    driver.adminStatus = "APPROVED";
    await driver.save();

    return res.json({
      message: "Driver approved successfully"
    });
  }
);

/**
 * ============================
 * ADMIN – REJECT DRIVER (OPTIONAL)
 * ============================
 */
router.patch(
  "/driver/:driverId/reject",
  authenticate,
  authorize("ADMIN"),
  async (req, res) => {
    const { driverId } = req.params;

    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(404).json({ error: "Driver not found" });
    }

    driver.adminStatus = "REJECTED";
    await driver.save();

    return res.json({
      message: "Driver rejected"
    });
  }
);

export default router;
