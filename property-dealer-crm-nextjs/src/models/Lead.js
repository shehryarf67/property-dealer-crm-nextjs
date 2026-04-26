import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Lead name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },

    propertyInterest: {
      type: String,
      required: [true, "Property interest is required"],
      trim: true,
    },

    budget: {
      type: Number,
      required: [true, "Budget is required"],
    },

    status: {
      type: String,
      enum: ["New", "Assigned", "Contacted", "In Progress", "Closed", "Lost"],
      default: "New",
    },

    notes: {
      type: String,
      default: "",
      trim: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    score: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Low",
    },

    followUpDate: {
      type: Date,
      default: null,
    },

    lastActivityAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Lead = mongoose.models.Lead || mongoose.model("Lead", leadSchema);

export default Lead;