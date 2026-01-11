// src/modules/drivers/driver.model.js
import mongoose from "mongoose";

const driverSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fullName: String,
  phone: String,
  vehicleType: String,
  vehicleNumber: String,
  city: String,
  status: {
    type: String,
    enum: ["PENDING", "VERIFIED", "REJECTED"],
    default: "PENDING"
  }
}, { timestamps: true });

export default mongoose.model("Driver", driverSchema);
