const express = require("express");
const { submitFeedback, getAllFeedbacks } = require("./controller");
const { userAuthenticationMiddleware } = require("../../v1/middleware");

const feedbackRouter = express.Router();
feedbackRouter.post("/submit", submitFeedback);
feedbackRouter.get("/all", userAuthenticationMiddleware, getAllFeedbacks);

module.exports = { feedbackRouter };
