const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const facebookBreakdownSchema = new Schema({
  breakdown: { type: [], required: false, unique: true },
});

facebookBreakdownSchema.plugin(uniqueValidator);

module.exports = mongoose.model("facebook-breakdown", facebookBreakdownSchema);
