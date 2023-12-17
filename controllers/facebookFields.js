const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

const AdInsights = require("../models/adInsights");
const CampaignInsights = require("../models/campaignInsights");
const AdCreatives = require("../models/adCreatives");
const AdSetInsights = require("../models/adSetInsights");
const Account = require("../models/account");
const AdSetLevel = require("../models/adSetLevel");
const CampaignFields = require("../models/campaignFields")
const HttpError = require("../models/httpError");

const saveAdInsights = async (req, res, next) => {
  const error = validationResult(req);
  const { adInsights } = req.body;

  for (let i = 0; i < adInsights.length; i++) {
    const adInsightsSave = new AdInsights({
      label: adInsights[i],
      value: uuidv4(),
    });
    try {
      await adInsightsSave.save();
    } catch (err) {
      const error = new HttpError(
        `Ad Insights save failed, please try again ${err}`,
        500
      );
      return next(error);
    }
  }

  res.status(201).json({ data: adInsights, message: "Saved successfully" });
};

const fetchInsights = async (req, res, next) => {
  const { insightName } = req.body;

  console.log('insightName', insightName)
  let response = [];
  try {
    if (insightName === "adInsights") {
      response = await AdInsights.find({},"");
    } else if (insightName === "campaignInsights") {
      response = await CampaignInsights.find({});
    } else if (insightName === "creativeLevel") {
      response = await AdCreatives.find({});
    } else if (insightName === "adSetInsights") {
      response = await AdSetInsights.find({});
    } else if (insightName === "accountLevel") {
      response = await Account.find({});
    }else if (insightName === "adSetLevel") {
      response = await AdSetLevel.find({});
    }else if (insightName === "campaignFields") {
      response = await CampaignFields.find({});
    }
  } catch (err) {
    const error = new HttpError(`Please try again ${err}`, 500);
    return next(error);
  }
  console.log('response', response)
  res
    .status(200)
    .json({ data: response.map((user) => user.toObject({ getters: true })) });
};

exports.saveAdInsights = saveAdInsights;
exports.fetchInsights = fetchInsights;
