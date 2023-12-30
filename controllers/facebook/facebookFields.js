const { v4: uuidv4 } = require("uuid");

const AdInsights = require("../../models/facebook/adInsights");
const CampaignInsights = require("../../models/facebook/campaignInsights");
const AdCreatives = require("../../models/facebook/adCreatives");
const AdSetInsights = require("../../models/facebook/adSetInsights");
const Account = require("../../models/facebook/account");
const AdSetLevel = require("../../models/facebook/adSetLevel");
const AdSetFields = require("../../models/facebook/adSetFields");
const HttpError = require("../../models/httpError");
const DatePreset = require("../../models/facebook/datePreset");
const Breakdowns = require("../../models/facebook/breakdowns");

const saveAdInsights = async (req, res, next) => {
  const { adInsights } = req.body;

  for (let i = 0; i < adInsights.length; i++) {
    const adInsightsSave = new AdInsights({
      label: adInsights[i],
      value: uuidv4(),
    });
    try {
      await adInsightsSave.save();
    } catch (err) {
      return res
      .status(500)
      .json({ data: {}, message: `Ad Insights save failed, please try again ${err}`, status: false });
    }
  }

  res.status(201).json({ data: adInsights, message: "Saved successfully", status: true });
};

const fetchInsights = async (req, res, next) => {
  const { insightName } = req.body;

  let response = [];
  try {
    if (insightName === "adInsights") {
      response = await AdInsights.find({}, "");
    } else if (insightName === "campaignInsights") {
      response = await CampaignInsights.find({});
    } else if (insightName === "creativeLevel") {
      response = await AdCreatives.find({});
    } else if (insightName === "adSetInsights") {
      response = await AdSetInsights.find({});
    } else if (insightName === "accountLevel") {
      response = await Account.find({});
    } else if (insightName === "adSetLevel") {
      response = await AdSetLevel.find({});
    } else if (insightName === "adSetFields") {
      response = await AdSetFields.find({});
    } else if (insightName === "datePreset") {
      response = await DatePreset.find({});
    } else if (insightName === "breakdowns") {
      response = await Breakdowns.find({});
    }
  } catch (err) {
    return res
    .status(500)
    .json({ data: {}, message: `Please try again ${err}`, status: false });
  }
  res
    .status(200)
    .json({ data: response, status: true, message: `Fetch ${insightName} fields` });
};

const fetchAllFacebookFields = async (req, res, next) => {
  const { insightNameList } = req.body;
  let response = {}
  try {
    for (let i = 0; i < insightNameList.length; i++) {
      if (insightNameList[i] === "adInsights") {
        const adInsightsResponse = await AdInsights.find({}, "");
        response["adInsights"] = adInsightsResponse;
      } else if (insightNameList[i] === "campaignInsights") {
        const campaignInsightsResponse = await CampaignInsights.find({});
        response["campaignInsights"] = campaignInsightsResponse;
      } else if (insightNameList[i] === "creativeLevel") {
        const creativeLevelResponse = await AdCreatives.find({});
        response["creativeLevel"] = creativeLevelResponse;
      } else if (insightNameList[i] === "adSetInsights") {
        const adSetInsightsResponse = await AdSetInsights.find({});
        response["adSetInsights"] = adSetInsightsResponse;
      } else if (insightNameList[i] === "accountLevel") {
        const accountLevelResponse = await Account.find({});
        response["accountLevel"] = accountLevelResponse;
      } else if (insightNameList[i] === "adSetLevel") {
        const adSetLevelResponse = await AdSetLevel.find({});
        response["adSetLevel"] = adSetLevelResponse;
      } else if (insightNameList[i] === "adSetFields") {
        const adSetFieldsResponse = await AdSetFields.find({});
        response["adSetFields"] = adSetFieldsResponse;
      } else if (insightNameList[i] === "datePreset") {
        const DatePresetResponse = await DatePreset.find({});
        response["datePreset"] = DatePresetResponse;
      } else if (insightNameList[i] === "breakdowns") {
        const BreakdownsResponse = await Breakdowns.find({});
        response["breakdowns"] = BreakdownsResponse;
      }
    }
  } catch (err) {
    return res
    .status(500)
    .json({ data: {}, message: `Please try again ${err}`, status: false });
  }
  res.status(200).json({ data: response, status: true, message: 'Fetch all fields' });
};

exports.saveAdInsights = saveAdInsights;
exports.fetchInsights = fetchInsights;
exports.fetchAllFacebookFields = fetchAllFacebookFields;
