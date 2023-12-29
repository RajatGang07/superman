const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const facebookAccountLevelSchema = new Schema({
  adInsights: { type: [], required: false, unique: true },

});

facebookAccountLevelSchema.plugin(uniqueValidator);

module.exports = mongoose.model("facebook-account-levels", facebookAccountLevelSchema);
