const RequestContext = require("../models/requestContext");
const Creator = require("../models/creator");
const Constants = require("../utils/constants");
const jwt = require("jsonwebtoken");
const config = require("../config");

function getToken(headers) {
  const bearer = headers.authorization;
  if (bearer) {
    const terms = bearer.split(" ");
    if (terms.length == 2) {
      return terms[1];
    }
  }

  return null;
}

function getAdditionalDetails(req) {
  const headers = req.headers;
  const {
    "x-forwarded-for": trackedIp,
    "x-device-id": deviceId,
    "user-agent": userAgent,
  } = headers;
  const ip = req.socket.remoteAddress;
  return {
    ip,
    device_id: deviceId,
    user_agent: userAgent,
    tracked_ip: trackedIp,
    ip_info: getIpInfo(ip),
  };
}

function getIpInfo(ipAddress) {
  return {
    range: [3479298048, 3479300095],
    country: "US",
    region: "TX",
    eu: "0",
    timezone: "America/Chicago",
    city: "San Antonio",
    ll: [29.4969, -98.4032],
    metro: 641,
    area: 1000,
  };
}

module.exports = (req, res, next) => {
  console.log("The request address: ", req.socket.remoteAddress);
  const token = getToken(req.headers); // Authorization :'BEARER TOKEN'
  const additionalDetails = getAdditionalDetails(req);
  req.context = new RequestContext(
    Constants.SYSTEM_ID,
    Creator.SYSTEM,
    additionalDetails
  );
  if (token) {
    try {
      const decodedToken = jwt.verify(token, config.jwt.secret);
      req.context = new RequestContext(
        decodedToken.userId,
        Creator.USER,
        additionalDetails
      );
    } catch (err) {
      /* 
               Ignoring error as a warning, if jwt is required, 
               it will be handled in authenticate middleware
            */
      console.warn("Exception occurred, while decoding JWT: ", err);
    }
  }

  return next();
};