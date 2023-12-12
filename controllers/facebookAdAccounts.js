const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const FacebookCredential = require("../models/facebookCredential");
const HttpError = require("../models/httpError");
const config = require("../config");

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

const fetchAdAcounts = async (req, res, next) => {
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

  let response;
  try {
    response = await getAdAccountList(existingUser?.accessToken);
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  try {
    await FacebookCredential.updateOne(
      { userId: userId },
      { accountList: response?.data?.data }
    );
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  console.log(response?.data, "response");

  return res.status(201).json({ response: response?.data });
};


const getAdCampaignAccountList = async (accessToken, actId, field) => {
  try {
    const appAccessTokenUrl = `https://graph.facebook.com/v18.0/${actId}/campaigns?fields=${field}&access_token=${accessToken}`;
    const response = await axios.get(appAccessTokenUrl);
    return response;
  } catch (error) {
    console.error(`Error: Failed to get app access token. ${error.message}`);
    return null;
  }
};

const fetchAdCampaignAcounts = async (req, res, next) => {
  const { field, actId, userId } = req.body;
  let existingUser;
  try {
    existingUser = await FacebookCredential.findOne({ userId: userId });
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError("Wrong user", 403);
    return next(error);
  }
  let response;
  try {
    response = await getAdCampaignAccountList(existingUser?.accessToken, actId, field);
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  console.log(response?.data, "response");

  return res.status(201).json({ response: response?.data });
};

exports.fetchAdAcounts = fetchAdAcounts;
exports.fetchAdCampaignAcounts = fetchAdCampaignAcounts;

