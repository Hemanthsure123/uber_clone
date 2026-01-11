import mongoose from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    // 🔗 Relation
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    // 👤 Personal Details
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true
    },

    gender: {
      type: String,
      enum: ["MALE", "FEMALE", "OTHERS"],
      required: true
    },

    age: {
      type: Number,
      required: true,
      min: 18
    },

    licenseNumber: {
      type: String,
      required: true,
      unique: true
    },

    // 📷 KYC
    selfieUrl: {
      type: String,
      default: null
    },

    // 🚗 Vehicle Details
    vehicle: {
      brand: {
        type: String,
        required: true
      },
      model: {
        type: String,
        required: true
      },
      category: {
        type: String,
        enum: ["BIKE", "SCOOTY", "AUTO", "CAR", "PREMIUM_CAB"],
        required: true
      },
      state: {
        type: String,
        required: true
      },
      rcNumber: {
        type: String,
        required: true,
        unique: true
      }
    },

    // 🛂 ADMIN APPROVAL STATUS
    adminStatus: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING"
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Driver", driverSchema);
