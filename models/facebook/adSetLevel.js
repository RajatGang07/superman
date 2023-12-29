const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const facebookAdSetLevelsSchema = new Schema({
  adInsights: { type: [], required: false, unique: true },

});

facebookAdSetLevelsSchema.plugin(uniqueValidator);

module.exports = mongoose.model("facebook-ad-set-levels", facebookAdSetLevelsSchema);
