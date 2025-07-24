const { FeedbackModel } = require("../../../models/FeedbackModel");
const { handleGenericAPIError } = require("../../../utils/controllerHelpers");

const submitFeedback = async (req, res) => {
  try {
    const { name, email, gender, doctor, purpose, message } = req.body;
    const newFeedback = await FeedbackModel.create({
      name,
      email,
      gender,
      doctor,
      purpose,
      message,
    });
    res.status(201).json({
      isSuccess: true,
      message: "Feedback submitted successfully!",
      data: newFeedback,
    });
  } catch (err) {
    handleGenericAPIError("submitFeedback", req, res, err);
  }
};
const getAllFeedbacks = async (req, res) => {
  try {
    const userRole = req.user?.role;

    if (userRole !== "admin") {
      return res.status(403).json({
        isSuccess: false,
        message: "Access denied. Only admins can view feedbacks.",
      });
    }

    const feedbacks = await FeedbackModel.find({}).sort({ createdAt: -1 }); // newest first

    res.status(200).json({
      isSuccess: true,
      message: "All feedbacks fetched successfully.",
      data: feedbacks,
    });
  } catch (err) {
    handleGenericAPIError("getAllFeedbacks", req, res, err);
  }
};
module.exports = { submitFeedback, getAllFeedbacks };
