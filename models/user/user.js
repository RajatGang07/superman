const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  companyName: { type: String, required: true },
  name: { type: String, required: true },
  mobileNumber: { type: Number, required: true, minlength: 10 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 8 },
  readTermsAndConditions: { type: Boolean, required: true },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("user-service", userSchema);