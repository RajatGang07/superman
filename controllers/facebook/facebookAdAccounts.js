const axios = require("axios");
const FacebookCredential = require("../../models/facebook/facebookCredential");

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
  if (!userId) {
    return res
    .status(401)
    .json({ data: {}, message: `Missing userId`, status: false });
  }
  
  let existingUser;

  try {
    existingUser = await FacebookCredential.findOne({ userId: userId });
  } catch (err) {
    return res
    .status(500)
    .json({ data: {}, message: err, status: false });
  }

  if (!existingUser) {
    return res
    .status(500)
    .json({ data: {}, message: "Wrong user", status: false });
  }

  let response;
  try {
    response = await getAdAccountList(existingUser?.accessToken);
  } catch (err) {
    return res
    .status(500)
    .json({ data: {}, message: err, status: false });
  }

  try {
    await FacebookCredential.updateOne(
      { userId: userId },
      { accountList: response?.data?.data }
    );
  } catch (err) {
    return res
    .status(500)
    .json({ data: {}, message: err, status: false });
  }

  return res.status(201).json({ data: response?.data, message: 'Fetch ad Accounts', status:true });
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
    return res
    .status(500)
    .json({ data: {}, message: err, status: false });
  }

  if (!existingUser) {
    return res
    .status(403)
    .json({ data: {}, message: "Wrong user", status: false });
  }
  let response;
  try {
    response = await getAdCampaignAccountList(existingUser?.accessToken, actId, field);
  } catch (err) {
    return res
    .status(500)
    .json({ data: {}, message: err, status: false });
  }

  return res.status(201).json({ data: response?.data, status: true, message: 'Fetch data ' });
};

exports.fetchAdAcounts = fetchAdAcounts;
exports.fetchAdCampaignAcounts = fetchAdCampaignAcounts;

