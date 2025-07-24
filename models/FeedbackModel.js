const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    doctor: { type: String, required: true },
    purpose: {
      type: String,
      enum: ["appointment", "feedback"],
      required: true,
    },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const FeedbackModel = mongoose.model("Feedback", feedbackSchema);
module.exports = { FeedbackModel };
