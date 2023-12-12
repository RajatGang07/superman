const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const FacebookCredential = require("../models/facebookCredential");
const HttpError = require("../models/httpError");
const config = require("../config");
const { INSIGHT_FIELDS } = require("../constant");

const getAdAccountList = async (accessToken) => {
  try {
    const appAccessTokenUrl = `https://graph.facebook.com/v18.0/me/adaccounts?fields=name,account_id&access_token=${accessToken}`;
    const response = await axios.get(appAccessTokenUrl);
    return response;
  } catch (error) {
    console.error(`Error: Failed to get app access token. ${error.message}`);
    return null;
  }
};

function flattenObject(obj, result, prefix = '') {
    for (const key in obj) {
      const newKey = prefix ? `${prefix}_${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        flattenObject(obj[key], result, newKey);
      } else {
        result[newKey] = obj[key];
      }
    }
  }
  
const fetchFacebookDataForAdvertsement = async (req, res, next) => {
  const { userId } = req.body;
  let existingUser;

  try {
    existingUser = await FacebookCredential.findOne({ userId: userId });
  } catch (err) {
    const error = new HttpError("Please login, please try again", 500);
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError("Wrong user", 403);
    return next(error);
  }

  let accountListOfLoggedInUser;
  try {
    accountListOfLoggedInUser = await getAdAccountList(
      existingUser?.accessToken
    );
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  try {
    for (
      let index = 0;
      index <= accountListOfLoggedInUser?.data?.data.length;
      index++
    ) {
      const adsURL = `https://graph.facebook.com/v18.0/${accountListOfLoggedInUser?.data?.data[index]?.id}/ads?access_token=${existingUser?.accessToken}`;
      const adsResponse = await axios.get(adsURL);
      for (
        let adsIndex = 0;
        adsIndex < adsResponse?.data?.data.length;
        adsIndex++
      ) {
        const insightURL = `https://graph.facebook.com/v18.0/${
          adsResponse?.data?.data[0]?.id
        }/insights?fields=${INSIGHT_FIELDS.join(",")}&access_token=${
          existingUser?.accessToken
        }`;


        // TODO add api url
        const campaignUrl = `act_362903427139242/campaigns/?fields=CAMPAIGN_FIELDS`
        // TO get adsts
        const url = `act_362903427139242/adsets`
        const adSet = `<adset_id>/?fields=ADSET_LEVEL`
        const adSetInsight = `<adset_id>/insights?fields=ADSET_FIELDS`

        const accountURL = `<acct_id>/?fields=ACCOUNT_LEVEL`

        const AdCreatives = `<ad_id>/adcreatives?fields=AD_CREATIVES`

        // console.log('insightURL', insightURL)
        const insightResponse = await axios.get(insightURL);
        // console.log("insightResponse", insightResponse?.data?.data, insightURL);
        console.log('1')
        const flattenedData = insightResponse?.data?.data.flatMap(item => {
            const result = {};
            flattenObject(item, result);
            return result;
          });

          
        console.log('flattenedData', flattenedData)
        const columnHeaders = Array.from(new Set(flattenedData.flatMap(item => Object.keys(item))));

        console.log("columnHeaders", columnHeaders);
        const currentdate = new Date();
        const datetime = currentdate.getDate() +
          "/" +
          (currentdate.getMonth() + 1) +
          "/" +
          currentdate.getFullYear() +
          " @ " +
          currentdate.getHours() +
          ":" +
          currentdate.getMinutes() +
          ":" +
          currentdate.getSeconds();

        const csvWriter = createCsvWriter({
          path: `${existingUser?.name}.csv`, // Output file path
          header: columnHeaders.map((header) => ({
            id: header,
            title: header,
          })),
        });

        csvWriter
          .writeRecords(flattenedData)
          .then(() => console.log("CSV file written successfully"))
          .catch((error) => console.error("Error writing CSV file:", error));
      }
    }
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  console.log(accountListOfLoggedInUser?.data, "accountListOfLoggedInUser");

  return res.status(201).json({ response: accountListOfLoggedInUser?.data });
};

exports.fetchFacebookDataForAdvertsement = fetchFacebookDataForAdvertsement;
