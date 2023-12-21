const axios = require("axios");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const cron = require('node-cron');

const FacebookCredential = require("../../models/facebookCredential");
const HttpError = require("../../models/httpError");

const facebookConfig = require("../../models/facebookConfig");

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
  let existingUser;
  let facebookConfigs;
  let totalResponse = [];
  let flattenedData = [];
  try {
    facebookConfigs = await facebookConfig.find();
    for (let i = 0; i < facebookConfigs.length; i++) {

      console.log('I am calling');
      cron.schedule(facebookConfigs[i].cron, async () => {
        console.log('I am calling 2');
        const INSIGHT_FIELDS = facebookConfigs[i].selectedAdInsights.map((item) => item.label);
        const CAMPAIGN_FIELDS = facebookConfigs[i].selectedAdSetFields.map((item) => item.label);
        const ADSET_LEVEL = facebookConfigs[i].selectedAdSetLevel.map((item) => item.label);
        const ADSET_FIELDS = facebookConfigs[i].selectedAdSetFields.map((item) => item.label);
        const ACCOUNT_LEVEL = facebookConfigs[i].selectedAccountLevel.map((item) => item.label);
        const AD_CREATIVES = facebookConfigs[i].selectedCreativeLevel.map((item) => item.label);
        existingUser = await FacebookCredential.findOne({
          userId: facebookConfigs[i].userId,
        });
        if (!existingUser) {
          const error = new HttpError("Wrong user", 403);
          return next(error);
        }
        const adAccountId = facebookConfigs[i]?.account?.value;
        if (adAccountId) {
          const adsURL = `https://graph.facebook.com/v18.0/${adAccountId}/ads?access_token=${existingUser?.accessToken}`;
          const adsResponse = await axios.get(adsURL);

          if (adsResponse?.data?.data.length > 0) {
            //adsIndex < adsResponse?.data?.data.length;
            for (let adsIndex = 0; adsIndex < 1; adsIndex++) {
              const adId = adsResponse?.data?.data[i]?.id;
              const insightURL = `https://graph.facebook.com/v18.0/${adId}/insights?fields=${INSIGHT_FIELDS.join(
                ","
              )}&date_preset=last_30d&access_token=${existingUser?.accessToken}`;
              const insightResponse = await axios.get(insightURL);
              const campaignURL = `https://graph.facebook.com/v18.0/${adAccountId}/campaigns?fields=${CAMPAIGN_FIELDS.join(
                ","
              )}&date_preset=last_30d&access_token=${existingUser?.accessToken}`;
              const campaignResponse = await axios.get(campaignURL);
  
              const fetchAdSets = `https://graph.facebook.com/v18.0/${adAccountId}/adsets?fields=${ADSET_FIELDS}&date_preset=last_30d&access_token=${existingUser?.accessToken}`;
              const adSetsResponse = await axios.get(fetchAdSets);
  
              const adSetId = insightResponse?.data?.data?.[i]?.adset_id;

              const adSetsURL = `https://graph.facebook.com/v18.0/${adSetId}?fields=${ADSET_LEVEL}&date_preset=last_30d&access_token=${existingUser?.accessToken}`;
              const adSetResponse = await axios.get(adSetsURL);
  
              const adSetInsightURL = `https://graph.facebook.com/v18.0/${adSetId}/insights?breakdowns=dma&date_preset=last_30d&access_token=${existingUser?.accessToken}`;
              const adSetInsightResponse = await axios.get(adSetInsightURL);
  
              const accountURL = `https://graph.facebook.com/v18.0/${adAccountId}?fields=${ACCOUNT_LEVEL}&date_preset=last_30d&access_token=${existingUser?.accessToken}`;
              const accountResponse = await axios.get(accountURL);
  
              const adCreativesURL = `https://graph.facebook.com/v18.0/${adAccountId}/adcreatives?fields=${AD_CREATIVES}&date_preset=last_30d&access_token=${existingUser?.accessToken}`;
              const adCreativesResponse = await axios.get(adCreativesURL);
  
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
                              ...insightResponse?.data?.data[
                                insightResponseIndex
                              ],
                              ...accountResponse?.data,
                              ...adSetsResponse?.data?.data[adSetsResponseIndex],
                              adSetId:
                                adSetsResponse?.data?.data[adSetsResponseIndex]
                                  .id,
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
      });

     
    }
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  return "Generated succesfully";
};

exports.fetchFacebookDataForAdvertsement = fetchFacebookDataForAdvertsement;
