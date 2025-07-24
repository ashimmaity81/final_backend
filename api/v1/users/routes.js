const express = require("express");
const {
  getUserByEmailController,
  updateUserRoleController,
  sendUserBasicInfoController,
  sendUserDetailsController,
  updateUserDetails,
  getAllAdminsController,
} = require("./controllers");
const { userAuthenticationMiddleware } = require("../../v1/middleware");

const usersRouter = express.Router();

// Middleware to restrict to superadmins only
const superadminOnly = (req, res, next) => {
  if (req.user.role !== "superadmin") {
    return res.status(403).json({
      isSuccess: false,
      message: "Access denied. Only superadmins allowed.",
    });
  }
  next();
};

// Routes
usersRouter.get(
  "/details-by-email",
  userAuthenticationMiddleware,
  superadminOnly,
  getUserByEmailController
);

usersRouter.put(
  "/update-role", // unified promote/demote route
  userAuthenticationMiddleware,
  superadminOnly,
  updateUserRoleController
);

usersRouter.get("/", userAuthenticationMiddleware, sendUserBasicInfoController);

usersRouter.get(
  "/details",
  userAuthenticationMiddleware,
  sendUserDetailsController
);

usersRouter.put("/update", userAuthenticationMiddleware, updateUserDetails);
usersRouter.get(
  "/admins",
  userAuthenticationMiddleware,
  getAllAdminsController
);

module.exports = { usersRouter };
