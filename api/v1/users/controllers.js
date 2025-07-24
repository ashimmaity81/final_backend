const { UserModel } = require("../../../models/userSchema");
const { handleGenericAPIError } = require("../../../utils/controllerHelpers");

// GET /users -> basic info
const sendUserBasicInfoController = (req, res) => {
  const userInfo = req.user;
  res.status(200).json({
    isSuccess: true,
    message: "User is valid!",
    data: {
      user: userInfo,
    },
  });
};

// GET /users/details -> full profile details
const sendUserDetailsController = async (req, res) => {
  try {
    const { _id } = req.user;
    const user = await UserModel.findById(_id).select("-password");

    if (!user) {
      return res.status(404).json({
        isSuccess: false,
        message: "User not found",
        data: null,
      });
    }

    res.status(200).json({
      isSuccess: true,
      message: "User details found!",
      data: { user },
    });
  } catch (err) {
    handleGenericAPIError("sendUserDetailsController", req, res, err);
  }
};

// PUT /users/update -> update name or gender
const updateUserDetails = async (req, res) => {
  try {
    const { _id } = req.user;
    const { name, gender } = req.body;

    const updateUser = await UserModel.findByIdAndUpdate(
      _id,
      { name, gender },
      { new: true }
    ).select("-password");

    if (!updateUser) {
      return res.status(404).json({
        isSuccess: false,
        message: "User not found",
        data: null,
      });
    }

    res.status(200).json({
      isSuccess: true,
      message: "Profile Updated",
      data: { user: updateUser },
    });
  } catch (err) {
    handleGenericAPIError("updateUserDetails", req, res, err);
  }
};

// GET /users/details-by-email?email=abc@xyz.com
const getUserByEmailController = async (req, res) => {
  try {
    const { email } = req.query;
    const user = await UserModel.findOne({ email }).select("-password");

    if (!user) {
      return res.status(404).json({
        isSuccess: false,
        message: "User not found",
        data: null,
      });
    }

    res.status(200).json({
      isSuccess: true,
      message: "User found",
      data: { user },
    });
  } catch (err) {
    handleGenericAPIError("getUserByEmailController", req, res, err);
  }
};

// PUT /users/update-role -> Promote or demote user
const updateUserRoleController = async (req, res) => {
  try {
    const { email, role, name, specialization, experience, gender } = req.body;

    if (!email || !role || !["admin", "user"].includes(role)) {
      return res.status(400).json({
        isSuccess: false,
        message: "Invalid email or role provided.",
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        isSuccess: false,
        message: "User not found.",
      });
    }

    if (user.role === role) {
      return res.status(400).json({
        isSuccess: false,
        message: `User is already a(n) ${role}.`,
      });
    }

    user.role = role;

    if (role === "admin") {
      // Validate required fields
      if (
        !name ||
        !specialization ||
        !experience ||
        !gender ||
        !["male", "female", "others"].includes(gender)
      ) {
        return res.status(400).json({
          isSuccess: false,
          message:
            "Name, Specialization, Experience, and Gender are required and must be valid to promote to admin.",
        });
      }

      user.name = name;
      user.specialization = specialization;
      user.experience = experience;
      user.gender = gender;
    } else if (role === "user") {
      // When demoting to user, clear admin-specific fields
      user.specialization = null;
      user.experience = null;
      user.gender = null;
      // Do NOT clear name here since user still has a name; superadmin manages name updates.
      // Alternatively, if you want to restrict name editing only by superadmin, you can keep it as is.
    }

    await user.save();

    res.status(200).json({
      isSuccess: true,
      message: `User role updated to ${role} successfully.`,
      data: { user },
    });
  } catch (err) {
    handleGenericAPIError("updateUserRoleController", req, res, err);
  }
};
const getAllAdminsController = async (req, res) => {
  try {
    const admins = await UserModel.find({ role: "admin" }).select("-password");
    res.status(200).json({
      isSuccess: true,
      message: "Admins list fetched",
      data: { admins },
    });
  } catch (err) {
    handleGenericAPIError("getAllAdminsController", req, res, err);
  }
};

module.exports = {
  sendUserBasicInfoController,
  sendUserDetailsController,
  updateUserDetails,
  getUserByEmailController,
  updateUserRoleController,
  getAllAdminsController,
};
