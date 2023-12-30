const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/user/user");
const config = require("../../config");

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, "-password");
    return res.json({
      users: users.map((user) => user.toObject({ getters: true })),
    });
  } catch (err) {
    return res
      .status(200)
      .json({ users: [], message: "No user found", status: false });
  }
};

const signUp = async (req, res) => {
  try {
    let { email, password, confirmPassword, name, mobileNumber, companyName, readTermsAndConditions } = req.body;

    if (!email || !password || !confirmPassword || !mobileNumber || !companyName || !readTermsAndConditions)
      return res.status(400).json({ message: "Not all fields have been entered.", status: false });
    if (password.length < 5)
      return res
        .status(400)
        .json({ message: "The password needs to be at least 5 characters long.", status: false });
    if (password !== confirmPassword)
      return res
        .status(400)
        .json({ message: "Enter the same password twice for verification.", status: false });

    const existingUser = await User.findOne({ email: email });
    if (existingUser)
      return res
        .status(400)
        .json({ message: "An account with this email already exists.", status: false });

    if (!name) name = email;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: passwordHash,
      name,
      mobileNumber,
      companyName,
      readTermsAndConditions
    });
    const savedUser = await newUser.save();
    res.status(200).send({
      status: true,
      data: {
        id: savedUser._id,
        name: savedUser.name,
        mobileNumber: savedUser.mobileNumber,
        companyName: savedUser.companyName,
        email: savedUser?.email
      },
      message: "Account created successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      result: null,
      message: err.message,
    });
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;
  if (!email || !password) {
    return res
    .status(401)
    .json({ data: {}, message: `Missing Email or Password`, status: false });
  }
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return res.status(500).json({
      data: {},
      message: "Logging failed, please try again",
      status: false,
    });
  }

  if (!existingUser) {
    return res
      .status(500)
      .json({ data: {}, message: "Wrong Password", status: false });
  }

  let isValidPassword = true;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    return res.status(403).json({
      data: {},
      message: "Check your credentials and try again",
      status: false,
    });
  }

  if (!isValidPassword) {
    return res.status(403).json({
      data: {},
      message: "Check your credentials and try again",
      status: false,
    });
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      config.jwt.secret,
      { expiresIn: "1h" }
    );
  } catch (err) {
    return res.status(500).json({
      data: {},
      message: "Login failed, please try again",
      status: false,
    });
  }

  return res.json({
    message: "Logged In",
    data: {
      userId: existingUser.id,
      email: existingUser.email,
      token: token,
    },
    status: true,
  });
};

exports.getUsers = getUsers;
exports.signUp = signUp;
exports.login = login;
