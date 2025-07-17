const { UserModel } = require("../../../models/userSchema");
const { handleGenericAPIError } = require("../../../utils/controllerHelpers");

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

const sendUserDetailsController = async (req, res) => {
  try {
    const { _id } = req.user;
    const user = await UserModel.findById(_id).select("-password");
    res.status(200).json({
      isSuccess: true,
      message: "User details found!",
      data: {
        user: user,
      },
    });
  } catch (err) {
    handleGenericAPIError("sendUserDetailsController", req, res, err);
  }
};
const updateUserDetails = async (req, res) => {
  try {
    const { _id } = req.user;
    const { name, gender } = req.body;
    const updateUser = await UserModel.findByIdAndUpdate(
      _id,
      { name, gender },
      { new: true }
    ).select("-password");
    res.status(200).json({
      isSuccess: true,
      message: "Profile Updated",
      data: {
        user: updateUser,
      },
    });
  } catch (err) {
    handleGenericAPIError("sendUserDetailsController", req, res, err);
  }
};

module.exports = {
  sendUserBasicInfoController,
  sendUserDetailsController,
  updateUserDetails,
};
