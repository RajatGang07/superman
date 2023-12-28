const axios = require("axios");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const FacebookCredential = require("../../models/facebookCredential");
const HttpError = require("../../models/httpError");

const {
  INSIGHT_FIELDS,
  CAMPAIGN_FIELDS,
  ADSET_LEVEL,
  ADSET_FIELDS,
  ACCOUNT_LEVEL,
  AD_CREATIVES,
} = require("../../constant");

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

function flattenObject(obj, result, prefix = "") {
  for (const key in obj) {
    const newKey = prefix ? `${prefix}_${key}` : key;
    if (typeof obj[key] === "object" && obj[key] !== null) {
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
    const error = new HttpError(err, 500);
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

  let totalResponse = [];
  let flattenedData = []
  try {
    for (let index = 0; index <= 1; index++) {
      //accountListOfLoggedInUser?.data?.data.length;
      const adAccountId = accountListOfLoggedInUser?.data?.data[index]?.id;
      if (adAccountId) {
        const adsURL = `https://graph.facebook.com/v18.0/${adAccountId}/ads?access_token=${existingUser?.accessToken}`;
        console.log("adsURL", adsURL);
        const adsResponse = await axios.get(adsURL);
        if (adsResponse?.data?.data.length > 0) {
          //adsIndex < adsResponse?.data?.data.length;
          for (let adsIndex = 0; adsIndex < 1; adsIndex++) {
            const adId = adsResponse?.data?.data[index]?.id;
            console.log("adId", adId);
            const insightURL = `https://graph.facebook.com/v18.0/${adId}/insights?fields=${INSIGHT_FIELDS.join(
              ","
            )}&date_preset=last_30d&access_token=${existingUser?.accessToken}`;
            const insightResponse = await axios.get(insightURL);
            console.log("insightURL", insightURL);
            console.log(
              "insightResponse?.data?.data",
              insightResponse?.data?.data
            );
            const campaignURL = `https://graph.facebook.com/v18.0/${adAccountId}/campaigns?fields=${CAMPAIGN_FIELDS.join(
              ","
            )}&date_preset=last_30d&access_token=${existingUser?.accessToken}`;
            const campaignResponse = await axios.get(campaignURL);
            console.log("campaignURL", campaignURL);

            console.log("campaignResponse", campaignResponse?.data?.data);

            const fetchAdSets = `https://graph.facebook.com/v18.0/${adAccountId}/adsets?fields=${ADSET_FIELDS}&date_preset=last_30d&access_token=${existingUser?.accessToken}`;
            const adSetsResponse = await axios.get(fetchAdSets);
            console.log("adSetsResponse", adSetsResponse?.data?.data);
            console.log("fetchAdSetsURL", fetchAdSets);

            const adSetId = insightResponse?.data?.data?.[index]?.adset_id;
            const campaignId =
              insightResponse?.data?.data?.[index]?.campaign_id;
            console.log("adSetId", adSetId);
            console.log("campaignId", campaignId);
            const adSetsURL = `https://graph.facebook.com/v18.0/${adSetId}?fields=${ADSET_LEVEL}&date_preset=last_30d&access_token=${existingUser?.accessToken}`;
            const adSetResponse = await axios.get(adSetsURL);
            console.log("adSetsURL", adSetsURL);

            console.log("adSetResponse", adSetResponse?.data);

            const adSetInsightURL = `https://graph.facebook.com/v18.0/${adSetId}/insights?breakdowns=dma&date_preset=last_30d&access_token=${existingUser?.accessToken}`;
            const adSetInsightResponse = await axios.get(adSetInsightURL);
            console.log(
              "adSetInsightResponse",
              adSetInsightResponse?.data?.data
            );
            console.log("adSetInsightURL", adSetInsightURL);

            const accountURL = `https://graph.facebook.com/v18.0/${adAccountId}?fields=${ACCOUNT_LEVEL}&date_preset=last_30d&access_token=${existingUser?.accessToken}`;
            const accountResponse = await axios.get(accountURL);
            console.log("accountResponse", accountResponse?.data);
            console.log("accountURL", accountURL);

            const adCreativesURL = `https://graph.facebook.com/v18.0/${adAccountId}/adcreatives?fields=${AD_CREATIVES}&date_preset=last_30d&access_token=${existingUser?.accessToken}`;
            const adCreativesResponse = await axios.get(adCreativesURL);
            console.log("adCreativesResponse", adCreativesResponse?.data?.data);
            console.log("adCreativesURL", adCreativesURL);

            const updatedAdData = [];
            for (
              let insightResponseIndex = 0;
              insightResponseIndex < insightResponse?.data?.data.length > 0;
              insightResponseIndex++
            ) {
              let newObj = {};
              for (
                let campaignResponseIndex = 0;
                campaignResponseIndex < campaignResponse?.data?.data.length > 0;
                campaignResponseIndex++
              ) {
                if (
                  campaignResponse?.data?.data[campaignResponseIndex].id ===
                  insightResponse?.data?.data[insightResponseIndex].campaign_id
                ) {
                  for (
                    let adSetsResponseIndex = 0;
                    adSetsResponseIndex < adSetsResponse?.data?.data.length > 0;
                    adSetsResponseIndex++
                  ) {

                    if (
                      adSetsResponse?.data?.data[adSetsResponseIndex].id ===
                      insightResponse?.data?.data[insightResponseIndex].adset_id
                    ) {
                    for (
                      let adSetInsightResponseIndex = 0;
                      adSetInsightResponseIndex <
                      adSetInsightResponse?.data?.data.length >
                      0;
                      adSetInsightResponseIndex++
                    ) {
                      // newObj={...newObj,...adSetInsightResponse?.data?.data[adSetInsightResponseIndex] }
                      for (
                        let adCreativesResponseIndex = 0;
                        adCreativesResponseIndex <
                        adCreativesResponse?.data?.data.length >
                        0;
                        adCreativesResponseIndex++
                      ) {
                        // newObj={...newObj,...adCreativesResponse?.data?.data[adCreativesResponseIndex], adCreativeId: adCreativesResponse?.data?.data[adCreativesResponseIndex].id }
                        newObj = {
                          ...campaignResponse?.data?.data[
                            campaignResponseIndex
                          ],
                          ...insightResponse?.data?.data[insightResponseIndex],
                          ...accountResponse?.data,
                          ...adSetsResponse?.data?.data[adSetsResponseIndex],
                          adSetId:
                            adSetsResponse?.data?.data[adSetsResponseIndex].id,
                          ...adSetInsightResponse?.data?.data[
                            adSetInsightResponseIndex
                          ],
                          ...adCreativesResponse?.data?.data[
                            adCreativesResponseIndex
                          ],
                          adCreativeId:
                            adCreativesResponse?.data?.data[
                              adCreativesResponseIndex
                            ].id,
                        };
                        updatedAdData.push(newObj);
                      }
                    }
                  }
                  }
                }
                // newObj = {...campaignResponse?.data?.data[campaignResponseIndex], ...insightResponse?.data?.data[insightResponseIndex], ...accountResponse?.data }
              }
            }

            totalResponse = [...totalResponse, ...updatedAdData];
          }
        }
      }
    }

    // console.log("totalResponse", totalResponse);
    flattenedData = totalResponse.flatMap((item) => {
      const result = {};
      flattenObject(item, result);
      return result;
    });

    const columnHeaders = Array.from(
      new Set(flattenedData.flatMap((item) => Object.keys(item)))
    );

    const currentdate = new Date();
    const datetime =
      currentdate.getDate() +
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
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  return res.status(201).json({ response: flattenedData });
};

exports.fetchFacebookDataForAdvertsement = fetchFacebookDataForAdvertsement;
