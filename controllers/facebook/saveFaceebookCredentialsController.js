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

  const { name, accessToken, userId, email, image, fbEmail } = req.body;

  let existingUser;

  try {
    existingUser = await FacebookCredential.findOne({ fbEmail: fbEmail, userId: userId });
  } catch (err) {
    return res
    .status(500)
    .json({ data: {}, message: err, status: false });
  }

  if (existingUser) {
    return res
    .status(500)
    .json({ data: {}, message: `${fbEmail} and ${userId} already exists`, status: false });
  }

  if (!name) {
    return res
    .status(401)
    .json({ data: {}, message: `Missing name`, status: false });
  }

  if (!email) {
    return res
    .status(401)
    .json({ data: {}, message: `Missing email`, status: false });
  }

  if (!fbEmail) {
    return res
    .status(401)
    .json({ data: {}, message: `Missing facebook email`, status: false });
  }

  if (!userId) {
    return res
    .status(401)
    .json({ data: {}, message: `Missing userId`, status: false });
  }
  
  const facebookUser = new FacebookCredential({
    name,
    accessToken,
    userId,
    email,
    image,
    fbEmail
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
};

exports.saveFaceebookCredentials = saveFaceebookCredentials;
