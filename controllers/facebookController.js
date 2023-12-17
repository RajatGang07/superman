const readline = require('readline');
const { validationResult } = require("express-validator");

const HttpError = require("../models/httpError");
const config = require("../config");
const FacebookCredential = require("../models/facebookCredential");

const fetchFacebookLogInUsers = async (req, res, next) => {
  const error = validationResult(req);
  const { userId } = req.body;

let existingUser;
  try {
    existingUser = await FacebookCredential.find({ userId: userId });
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  console.log('existingUser', existingUser)
 
  return res.json({ existingFacebookUserList: existingUser.map((user) => user.toObject({ getters: true })) });
};

exports.fetchFacebookLogInUsers = fetchFacebookLogInUsers;