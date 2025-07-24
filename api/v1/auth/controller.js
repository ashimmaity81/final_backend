const { OtpModel } = require("../../../models/otpSchema");
const { UserModel } = require("../../../models/userSchema");
const bcrypt = require("bcrypt");
const { customAlphabet } = require("nanoid");
const { attachJWTToken, removeJWTToken } = require("../../../utils/jwtHelpers");
const { handleGenericAPIError } = require("../../../utils/controllerHelpers");
const { sendOtpMail } = require("../../../utils/emailHelpers");

const nanoid = customAlphabet("1234567890", 6);

const userSignupController = async (req, res) => {
  console.log("--> inside userSignupController");
  try {
    const { email, password, otp } = req.body;

    // Check if user already exists
    const user = await UserModel.findOne({ email }).lean();
    if (user !== null) {
      return res.status(400).json({
        isSuccess: false,
        message: "User already exists! Please Login",
        data: {},
      });
    }

    // Check if OTP was sent before
    const sentOtpDoc = await OtpModel.findOne({ email }).lean();
    if (!sentOtpDoc) {
      return res.status(400).json({
        isSuccess: false,
        message: "Please resend the otp!",
        data: {},
      });
    }

    const { otp: hashedOtp } = sentOtpDoc;
    const isCorrect = await bcrypt.compare(otp.toString(), hashedOtp);
    if (!isCorrect) {
      return res.status(400).json({
        isSuccess: false,
        message: "Incorrect otp! Please try again...",
        data: {},
      });
    }

    // Assign role: only this email can be superadmin
    let role = "user";
    if (email === "maityashim81@gmail.com") {
      role = "superadmin";
    }

    // Prevent malicious manual superadmin assignment
    if (
      req.body.role &&
      req.body.role === "superadmin" &&
      email !== "maityashim81@gmail.com"
    ) {
      return res.status(403).json({
        isSuccess: false,
        message: "Only maityashim81@gmail.com can be a superadmin!",
        data: {},
      });
    }

    await UserModel.create({ email, password, role });

    res.status(201).json({
      isSuccess: true,
      message: "User created!",
      data: { email, role },
    });
  } catch (err) {
    handleGenericAPIError("userSignupController", req, res, err);
  }
};

const sendOtpController = async (req, res) => {
  console.log("--> inside sendOtpController");
  try {
    const { email } = req.body;

    const otp = nanoid();

    await sendOtpMail(email, otp);

    // Store hashed OTP for security
    const hashedOtp = await bcrypt.hash(otp, 10);
    await OtpModel.findOneAndUpdate(
      { email },
      { otp: hashedOtp },
      { upsert: true }
    );

    res.status(201).json({ isSuccess: true, message: "Otp sent!" });
  } catch (err) {
    handleGenericAPIError("sendOtpController", req, res, err);
  }
};

const userLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email }).lean();

    if (!user) {
      return res.status(400).json({
        isSuccess: false,
        message: "User does not exist! Please sign up first!",
        data: {},
      });
    }

    const { password: hashedPassword } = user;
    const isCorrect = await bcrypt.compare(password.toString(), hashedPassword);

    if (!isCorrect) {
      return res.status(400).json({
        isSuccess: false,
        message: "Incorrect password! Please try again...",
        data: {},
      });
    }

    attachJWTToken(res, { email: user.email, _id: user._id, role: user.role });

    res.status(200).json({
      isSuccess: true,
      message: "Login successful!",
      data: { user: { email: user.email, _id: user._id, role: user.role } },
    });
  } catch (err) {
    handleGenericAPIError("userLoginController", req, res, err);
  }
};

const logoutController = async (req, res) => {
  console.log("--> inside logoutController");
  removeJWTToken(res, {});
  res.status(200).json({ isSuccess: true, message: "Logout success!" });
};

module.exports = {
  userSignupController,
  userLoginController,
  sendOtpController,
  logoutController,
};
