const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const facebookConfig = new Schema({
  configName: { type: String, required: true, unique: true },
  account: { type: [], required: true },
  campaign: { type: [], required: false, unique: false },
  selectedAccountLevel: { type: [], required: false, unique: false },
  selectedAdInsights: { type: [], required: false, unique: false },
  selectedAdSetInsights: { type: [], required: false, unique: false },
  selectedAdSetLevel: { type: [], required: false, unique: false },
  selectedAdSetFields: { type: [], required: false, unique: false },
  selectedCampaignInsights: { type: [], required: false, unique: false },
  selectedCreativeLevel: { type: [], required: false, unique: false },
  userId: { type: String, required: true },
  configDays: {type: Object, required: true},
  selectedDays: { type: [], required: false, unique: false },
  cron: { type: String, required: true },
  selectedDataSource: { type: String, required: true },
  selectedFacebookUser: { type: Object, required: true },
  datePreset:{ type: Object, required: false, unique: false },
  breakdowns:{ type: [], required: false, unique: false },
  timeIncrement:{ type: Object, required: false, unique: false },
  createdAt: { type: Date, required: true },

});

facebookConfig.plugin(uniqueValidator);

module.exports = mongoose.model("facebook-config", facebookConfig);
