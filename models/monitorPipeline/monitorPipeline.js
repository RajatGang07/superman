const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const monitorPipeline = new Schema({
  name: { type: String, required: true},
  account: { type: Object, required: true },
  status: { type: String, required: true },
  message: { type: String, required: true },
  filePath: { type: String, required: true },
  createdAt: { type: Date, required: true },
  userId: { type: String, required: true },
  configDays: {type: Object, required: true},
  selectedDays: { type: [], required: false, unique: false },
  cron: { type: String, required: true },

});

monitorPipeline.plugin(uniqueValidator);

module.exports = mongoose.model("monitor-pipeline", monitorPipeline);
