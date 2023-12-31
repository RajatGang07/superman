const { ObjectId } = require("mongodb");

const FacebookCredential = require("../../models/facebook/facebookCredential");

const fetchFacebookLogInUsers = async (req, res, next) => {
  const { userId } = req.body;
  if (!userId) {
    return res
    .status(401)
    .json({ data: {}, message: `Missing userId`, status: false });
  }
  let existingUser;
  try {
    existingUser = await FacebookCredential.find({ userId: userId });
  } catch (err) {
    return res
    .status(500)
    .json({ data: {}, message: `Something went wrong ${err.message}`, status: false });
  }
  return res.json({ data: existingUser.map((user) => user.toObject({ getters: true })), status: true });

};

const deleteFacebookLogInUsers = async (req, res, next) => {
  const { id } = req.body;
  if (!id) {
    return res
    .status(401)
    .json({ data: {}, message: `Missing id`, status: false });
  }
  const query = { _id: new ObjectId(id) };

  try {
    const result = await FacebookCredential.deleteOne(query);
    if (result.deletedCount === 1) {
      return res.json({ message: "User deleted successfully", status: true });
    } else {
      return res.json({ message: "User not found", status: false });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ data: {}, message: "Something went wrong", status: false });
  }
};

exports.fetchFacebookLogInUsers = fetchFacebookLogInUsers;
exports.deleteFacebookLogInUsers = deleteFacebookLogInUsers;
