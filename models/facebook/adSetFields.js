const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const facebookAdSetFields = new Schema({
  adSetFields: { type: [], required: false, unique: true },

});

facebookAdSetFields.plugin(uniqueValidator);

module.exports = mongoose.model("facebook-adSet-fields", facebookAdSetFields);
