const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const HttpError = require("../models/httpError");
const config = require("../config");

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, "-password");
    res.json({ users: users.map((user) => user.toObject({ getters: true })) });
  } catch (err) {
    const error = new HttpError("No user found", 500);
    return next(error);
  }
};

const signUp = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    const error = new HttpError(
      "Invalid inputs passed, Please check your data",
      422
    );
    return next(error);
  }

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Singup failed", 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError("User exist already", 422);
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError("Could not create user, please try again", 500);
    return next(error);
  }
  const createdUser = new User({
    name,
    email,
    password: hashedPassword,
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Sign up failed, please try again", 500);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      config.jwt.secret,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Sign up failed, please try again", 500);
    return next(error);
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Logging failed, please try again", 500);
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError("Wrong Password", 403);
    return next(error);
  }

  let isValidPassword = true;
  // try {
  //     isValidPassword = await bcrypt.compare(password, existingUser.password);
  // } catch (err) {
  //     const error = new HttpError('Check your credentials and try again', 403);
  //     return next(error);
  // }

  if (!isValidPassword) {
    const error = new HttpError("Check your credentials and try again", 403);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      config.jwt.secret,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Login failed, please try again", 500);
    return next(error);
  }

  res.json({
    message: "Logged In",
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
  });
};

exports.getUsers = getUsers;
exports.signUp = signUp;
exports.login = login;