const readline = require('readline');
const { validationResult } = require("express-validator");
const {  ObjectId } = require('mongodb');

const HttpError = require("../../models/httpError");
const config = require("../../config");
const FacebookCredential = require("../../models/facebookCredential");

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
 
  return res.json({ existingFacebookUserList: existingUser.map((user) => user.toObject({ getters: true })) });
};

const deleteFacebookLogInUsers = async (req, res, next) => {
  const error = validationResult(req);
  const { id } = req.body;

  const query = { _id: new ObjectId(id) };

  try {
    const result = await FacebookCredential.deleteOne(query);
    if (result.deletedCount === 1) {
      return res.json({ message: "User deleted successfully" });
    } else {
      return res.json({ message: "User not found" });
    }
  } catch (err) {
    console.log('err', err)
    const error = new HttpError(err, 500);
    return next(error);
  }
};

exports.fetchFacebookLogInUsers = fetchFacebookLogInUsers;
exports.deleteFacebookLogInUsers = deleteFacebookLogInUsers;