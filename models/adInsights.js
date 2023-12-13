const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const facebookadInsightsSchema = new Schema({
    label: { type: String, required: true },
    value: { type: String, required: true },
});

facebookadInsightsSchema.plugin(uniqueValidator);

module.exports = mongoose.model("facebook-ad-creatives-level", facebookadInsightsSchema);
