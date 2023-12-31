const { validationResult } = require("express-validator");
const FacebookCredential = require("../../models/facebook/facebookCredential");

const saveFaceebookCredentials = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res
      .status(500)
      .json({
        data: {},
        message: `Invalid inputs passed, Please check your data`,
        status: false,
      });
  }

  const { name, accessToken, userId, email, image } = req.body;

  const facebookUser = new FacebookCredential({
    name,
    accessToken,
    userId,
    email,
    image,
  });

  try {
    console.log("I am calling twice?");
    await facebookUser.save();
    return res
      .status(200)
      .json({
        data: {},
        message: `Credentials save succesfully`,
        status: true,
      });
  } catch (err) {
    return res
      .status(500)
      .json({
        data: {},
        message: `Facebbok credentials save failed, please try again ${err}`,
        status: false,
      });
  }

  res
    .status(201)
    .json({
      data: { name: facebookUser.name, email: facebookUser.email },
      status: true,
      message: "Save all data",
    });
};

exports.saveFaceebookCredentials = saveFaceebookCredentials;
