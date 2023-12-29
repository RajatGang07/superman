const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const facebookDatePresetSchema = new Schema({
  datePreset: { type: [], required: false, unique: true },

});

facebookDatePresetSchema.plugin(uniqueValidator);

module.exports = mongoose.model("facebook-date-preset", facebookDatePresetSchema);
