const { validationResult } = require("express-validator");
const {  ObjectId } = require('mongodb');

const FacebookConfig = require("../../models/facebook/facebookConfig");

const getFacebookConfig = async (req, res, next) => {
  const error = validationResult(req);
  const { userId } = req.body;
  if (!userId) {
    return res
    .status(401)
    .json({ data: {}, message: `Missing userId`, status: false });
  }
  try {
    const facebookConfigs = await FacebookConfig.find({ userId: userId });
    const sortedList = facebookConfigs.sort((a, b) => b.createdAt - a.createdAt);

    res.json({
      data: sortedList.map((facebookConfig) =>
      facebookConfig.toObject({ getters: true })
    ), status: true, message: 'Fetched data stream'
    });
  } catch (err) {
    return res
    .status(500)
    .json({ data: {}, message: "No config found", status: false });
  }
};

const saveFacebookConfig = async (req, res, next) => {
  const {
    configName,
    account,
    campaign,
    selectedAccountLevel,
    selectedAdInsights,
    selectedAdSetInsights,
    selectedAdSetLevel,
    selectedAdSetFields,
    selectedCampaignInsights,
    selectedCreativeLevel,
    userId,
    configDays,
    selectedDays,
    cron,
    selectedDataSource,
    selectedFacebookUser,
    datePreset,
    breakdowns,
    timeIncrement

  } = req.body;

  try {
    const createConfig = new FacebookConfig({
      configName,
      account,
      campaign,
      selectedAccountLevel,
      selectedAdInsights,
      selectedAdSetInsights,
      selectedAdSetLevel,
      selectedAdSetFields,
      selectedCampaignInsights,
      selectedCreativeLevel,
      userId,
      configDays,
      selectedDays,
      cron,
      selectedDataSource,
      selectedFacebookUser,
      datePreset,
      breakdowns,
      timeIncrement,
      createdAt: new Date().getTime(),
    });

    await createConfig.save();
  } catch (err) {
    return res
    .status(500)
    .json({ data: {}, message: "Something went wrong", status: false });
  }

  return res.json({ message: "Config saved successfully", status: true });
};

const deleteFacebookConfig = async (req, res, next) => {
  const { id } = req.body;
  if (!id) {
    return res
    .status(401)
    .json({ data: {}, message: `Missing id`, status: false });
  }
  const query = { _id: new ObjectId(id) };

  try {
    const result = await FacebookConfig.deleteOne(query);
    if (result.deletedCount === 1) {
      return res.json({ message: "Data Stream deleted successfully", status: true });
    } else {
      return res.json({ message: "Data Stream not found", status: false });
    }
  } catch (err) {
    return res
    .status(500)
    .json({ data: {}, message: "Something went wrong", status: false });
  }
};

const updateFacebookConfig = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res
    .status(500)
    .json({ data: {}, message: `Invalid inputs passed, Please check your data`, status: false });
  }
  
  const {
    configName,
    account,
    campaign,
    selectedAccountLevel,
    selectedAdInsights,
    selectedAdSetInsights,
    selectedAdSetLevel,
    selectedAdSetFields,
    selectedCampaignInsights,
    selectedCreativeLevel,
    userId,
    id,
    configDays,
    selectedDays,
    cron,
    selectedDataSource,
    selectedFacebookUser,
    datePreset,
    breakdowns,
    timeIncrement
  } = req.body;

  const newData = {
    $set: {
      configName,
      account,
      campaign,
      selectedAccountLevel,
      selectedAdInsights,
      selectedAdSetInsights,
      selectedAdSetLevel,
      selectedAdSetFields,
      selectedCampaignInsights,
      selectedCreativeLevel,
      userId,
      configDays,
      selectedDays,
      cron,
      selectedDataSource,
      selectedFacebookUser,
      datePreset,
      breakdowns,
      timeIncrement,
      createdAt: new Date().getTime(),
    },
  };

  const query = { _id: new ObjectId(id) };
  if (!id) {
    return res
    .status(401)
    .json({ data: {}, message: `Missing id`, status: false });
  }
  try {
    const result = await FacebookConfig.updateOne(query, newData);
    if (result.modifiedCount === 1) {
      return res.json({ config: "Config updated successfully" });
    } else {
      return res.json({ config: "Document not found or not modified" });
    }
  } catch (err) {
    return res
    .status(500)
    .json({ data: {}, message: `Something went wrong ${err}`, status: false });
  }
};

exports.saveFacebookConfig = saveFacebookConfig;
exports.getFacebookConfig = getFacebookConfig;
exports.deleteFacebookConfig = deleteFacebookConfig;
exports.updateFacebookConfig = updateFacebookConfig;
