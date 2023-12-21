const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const FacebookCredential = require("../../models/facebookCredential");
const HttpError = require("../../models/httpError");
const config = require("../../config");

const saveFaceebookCredentials = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    const error = new HttpError(
      "Invalid inputs passed, Please check your data",
      422
    );
    return next(error);
  }

  const { name, accessToken, userId, email, image } = req.body;

  const facebookUser = new FacebookCredential({
    name,
    accessToken,
    userId,
    email,
    image
  });

  try {
    await facebookUser.save();
    
  } catch (err) {
    const error = new HttpError(`Facebbok credentials save failed, please try again ${err}`, 500);
    return next(error);
  }

  res.status(201).json({ name: facebookUser.name, email: facebookUser.email });
};

exports.saveFaceebookCredentials = saveFaceebookCredentials;
