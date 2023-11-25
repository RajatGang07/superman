const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const jwt = require("jsonwebtoken");
// const readline = require('readline-sync');
const readline = require('readline');

const User = require("../models/user");
const HttpError = require("../models/httpError");
const config = require("../config");

const getAppAccessToken = async (appId, appSecret) => {
    console.log("Step 1: Get App Access Token");
    const appAccessTokenUrl = `https://graph.facebook.com/v18.0/oauth/access_token?client_id=${appId}&client_secret=${appSecret}&grant_type=client_credentials`;
    
    try {
      const response = await axios.get(appAccessTokenUrl);
      const appAccessToken = response.data.access_token;
      return appAccessToken;
    } catch (error) {
      console.error(`Error: Failed to get app access token. ${error.message}`);
      return null;
    }
  };


  const getUserAccessToken = async (appId, redirectUri) => {
    console.log("Step 2: Get User Access Token");
  
    const authorizationUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=ads_read&response_type=code`;
    console.log(`Visit the following URL to get the authorization code: ${authorizationUrl}`);

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      rl.question('Enter the authorization code: ', (userInput) => {
        rl.close();
         authenticateWithFacebook(userInput);
      });
  };

const authenticateWithFacebook = async (userInput) =>{
    try {
        const userAccessTokenUrl = `https://graph.facebook.com/v18.0/oauth/access_token?client_id=2584462238376302&redirect_uri=https://beigebananas.com/blog/&client_secret=8a05ff0e33ce2af0c676659a0d3cd27a&code=${userInput}`;

        const response = await axios.get(userAccessTokenUrl);
        console.log('getUserAccessToken', response)
        const userAccessToken = response.data.access_token;
        return userAccessToken;
      } catch (error) {
        console.error(`Error: Failed to get user access token. ${error.message}`);
        return null;
      }
}

const getAuthenticate = async (req, res, next) => {
  const error = validationResult(req);

let response, response1 ;
  try {
    response1 = await getUserAccessToken(config?.app_id, config?.uri_Redirect)
    response =  await getAppAccessToken('2584462238376302', '8a05ff0e33ce2af0c676659a0d3cd27a');
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

 
//   return response;
  return res
    .status(201)
    .json({ response: response, response1: response1 });
};

exports.getAuthenticate = getAuthenticate;