const express = require("express");
const { authRouter } = require("./auth/routes");
const { usersRouter } = require("./users/routes");
const { feedbackRouter } = require("./feedback/routes");
const { userAuthenticationMiddleware } = require("./middleware");

const apiRouter = express.Router();

apiRouter.use("/auth", authRouter);

apiRouter.use(userAuthenticationMiddleware);
apiRouter.use("/users", usersRouter);
apiRouter.use("/feedback", feedbackRouter);

module.exports = { apiRouter };
