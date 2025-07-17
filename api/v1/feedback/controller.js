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

module.exports = { submitFeedback };
