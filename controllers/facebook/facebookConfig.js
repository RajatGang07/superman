const { validationResult } = require("express-validator");
const {  ObjectId } = require('mongodb');

const HttpError = require("../../models/httpError");
const FacebookConfig = require("../../models/facebookConfig");

const getFacebookConfig = async (req, res, next) => {
  const { userId } = req.body;
  try {
    const facebookConfigs = await FacebookConfig.find({ userId: userId });
    res.json({
      facebookConfig: facebookConfigs.map((facebookConfig) =>
        facebookConfig.toObject({ getters: true })
      ),
    });
  } catch (err) {
    const error = new HttpError("No user found", 500);
    return next(error);
  }
};

const saveFacebookConfig = async (req, res, next) => {
  const error = validationResult(req);
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
    selectedFacebookUser
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
      selectedFacebookUser
    });

    await createConfig.save();
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  return res.json({ config: "Config saved successfully" });
};

const deleteFacebookConfig = async (req, res, next) => {
  const { id } = req.body;

  const query = { _id: new ObjectId(id) };

  try {
    const result = await FacebookConfig.deleteOne(query);
    if (result.deletedCount === 1) {
      return res.json({ message: "Document deleted successfully" });
    } else {
      return res.json({ message: "Document not found" });
    }
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }
};

const updateFacebookConfig = async (req, res, next) => {
  const error = validationResult(req);
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
    selectedFacebookUser
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
      selectedFacebookUser
    },
  };

  const query = { _id: new ObjectId(id) };

  try {
    const result = await FacebookConfig.updateOne(query, newData);
    if (result.modifiedCount === 1) {
      return res.json({ config: "Config updated successfully" });
    } else {
      return res.json({ config: "Document not found or not modified" });
    }
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }
};

exports.saveFacebookConfig = saveFacebookConfig;
exports.getFacebookConfig = getFacebookConfig;
exports.deleteFacebookConfig = deleteFacebookConfig;
exports.updateFacebookConfig = updateFacebookConfig;
