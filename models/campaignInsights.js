const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const campaignInsightsSchema = new Schema({
  campaignInsights: { type: [], required: false, unique: true },

});

campaignInsightsSchema.plugin(uniqueValidator);

module.exports = mongoose.model("facebook-campaign-insights-services", campaignInsightsSchema);
