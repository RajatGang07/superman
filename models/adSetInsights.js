const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const adSetInsightsSchema = new Schema({
  adSetInsights: { type: [], required: false, unique: true },

});

adSetInsightsSchema.plugin(uniqueValidator);

module.exports = mongoose.model("facebook-ad-sets-insights-services", adSetInsightsSchema);
