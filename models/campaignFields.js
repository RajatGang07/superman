const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const facebookCampaignFields = new Schema({
  adInsights: { type: [], required: false, unique: true },

});

facebookCampaignFields.plugin(uniqueValidator);

module.exports = mongoose.model("facebook-campaign-fields", facebookCampaignFields);
