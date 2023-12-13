const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const facebookadInsightsSchema = new Schema({
  adInsights: { type: [], required: false, unique: true },

});

facebookadInsightsSchema.plugin(uniqueValidator);

module.exports = mongoose.model("facebook-ad-insights-services", facebookadInsightsSchema);
