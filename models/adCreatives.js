const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const facebookAdCreatives = new Schema({
  adInsights: { type: [], required: false, unique: true },

});

facebookAdCreatives.plugin(uniqueValidator);

module.exports = mongoose.model("facebook-ad-creatives-levels", facebookAdCreatives);
