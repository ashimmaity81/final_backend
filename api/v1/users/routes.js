const express = require("express");
const {
  sendUserBasicInfoController,
  sendUserDetailsController,
  updateUserDetails,
} = require("./controllers");
const { userAuthenticationMiddleware } = require("../../v1/middleware");

const usersRouter = express.Router();

usersRouter.get("/", userAuthenticationMiddleware, sendUserBasicInfoController);
usersRouter.get(
  "/details",
  userAuthenticationMiddleware,
  sendUserDetailsController
);
usersRouter.put("/update", userAuthenticationMiddleware, updateUserDetails);

module.exports = { usersRouter };
