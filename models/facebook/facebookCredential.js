const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const facebookSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: false },
  accessToken: { type: String, required: true, unique: false },
  userId: { type: String, required: true, unique: false },
  image: { type: String, required: false, unique: false },
  accountList: { type: [], required: false, unique: false },
  fbEmail: { type: String, required: true, unique: false },

});

facebookSchema.plugin(uniqueValidator);

module.exports = mongoose.model("facebook-services", facebookSchema);
