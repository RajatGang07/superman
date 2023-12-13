const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

const AdInsights = require("../models/adInsights");
const HttpError = require("../models/httpError");

const saveAdInsights = async (req, res, next) => {
  const error = validationResult(req);
  const { adInsights } = req.body;
  console.log("adInsightFields", adInsights);

  for (let i = 0; i < adInsights.length; i++) {
    const adInsightsSave = new AdInsights({
      label: adInsights[i],
      value: uuidv4(),
    });
    console.log("adInsightsSave", adInsightsSave);
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

exports.saveAdInsights = saveAdInsights;
