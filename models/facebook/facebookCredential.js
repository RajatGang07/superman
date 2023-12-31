const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const facebookSchema = new Schema({
  name: { type: String, required: false },
  email: { type: String, required: false, unique: false },
  accessToken: { type: String, required: true, unique: true },
  userId: { type: String, required: false, unique: false },
  image: { type: String, required: false, unique: true },
  accountList: { type: [], required: false, unique: false },

});

facebookSchema.plugin(uniqueValidator);

module.exports = mongoose.model("facebook-services", facebookSchema);
