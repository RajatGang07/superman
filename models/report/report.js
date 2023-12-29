const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const reportConfig = new Schema({
  name: { type: String, required: true, unique: false },
  userId: { type: String, required: true },
  url: { type: String, required: true },
});

reportConfig.plugin(uniqueValidator);

module.exports = mongoose.model("report", reportConfig);
