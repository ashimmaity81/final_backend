const express = require("express");
const { submitFeedback } = require("./controller");

const feedbackRouter = express.Router();
feedbackRouter.post("/submit", submitFeedback);

module.exports = { feedbackRouter };
