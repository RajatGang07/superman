const axios = require("axios");

const FacebookCredential = require("../../models/facebook/facebookCredential");
const HttpError = require("../../models/httpError");

const FacebookConfig = require("../../models/facebook/facebookConfig");

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

const fetchFacebookDataForSingleConfigPreview = async (req, res, next) => {
  const {
    cron,
    datePreset = "last_30d",
    timeIncrement,
    breakdowns,
    selectedAdInsights,
    selectedCampaignInsights,
    selectedAdSetLevel,
    selectedAdSetFields,
    selectedAccountLevel,
    selectedCreativeLevel,
    userId,
    account,
  } = req.body;

  let existingUser;
  let totalResponse = [];
  let flattenedData = [];
  try {
    for (let i = 0; i < account.length; i++) {
      console.log("I am calling", cron);
      // cron.schedule('* * * * *', async () => {
      const date_Preset = datePreset ? datePreset.label : "last_30d";
      const time_Increment = timeIncrement ? timeIncrement.label : "all_days";
      const break_downs = breakdowns.map((item) => item.label);

      const INSIGHT_FIELDS = selectedAdInsights.map((item) => item.label);
      const CAMPAIGN_FIELDS = selectedCampaignInsights.map(
        (item) => item.label
      );
      const ADSET_LEVEL = selectedAdSetLevel.map((item) => item.label);
      const ADSET_FIELDS = selectedAdSetFields.map((item) => item.label);
      const ACCOUNT_LEVEL = selectedAccountLevel.map((item) => item.label);
      const AD_CREATIVES = selectedCreativeLevel.map((item) => item.label);
      existingUser = await FacebookCredential.findOne({
        userId: userId,
      });
      // console.log('INSIGHT_FIELDS',INSIGHT_FIELDS)
      // console.log('date_Preset',date_Preset)
      // console.log('time_Increment',time_Increment)
      // console.log('break_downs',break_downs)

      if (!existingUser) {
        return res
          .status(500)
          .json({ data: {}, message: `Wrong user`, status: false });
      }
      for(let accountCounter = 0;accountCounter< facebookConfigs[i]?.account.length; accountCounter++){
      const adAccountId = account?.[accountCounter]?.value;
      console.log('adAccountId',adAccountId)
  
      if (adAccountId) {
        const adsURL = `https://graph.facebook.com/v18.0/${adAccountId}/ads?access_token=${existingUser?.accessToken}`;
        console.log('adsURL', adsURL)
        const adsResponse = await axios.get(adsURL);
        console.log('adsResponse', adsResponse?.data?.data)

        if (adsResponse?.data?.data.length > 0) {
          for (
            let adsIndex = 0;
            adsIndex < adsResponse?.data?.data.length;
            adsIndex++
          ) {
            const adId = adsResponse?.data?.data[i]?.id;
            console.log('adsResponse', adsResponse?.data?.data)

            const insightURL = `https://graph.facebook.com/v18.0/${adId}/insights?fields=${INSIGHT_FIELDS.join(
              ","
            )}&date_preset=${date_Preset}&time_increment=${time_Increment}&access_token=${existingUser?.accessToken}`;
            const insightResponse = await axios.get(insightURL);
            console.log('insightResponse', insightResponse?.data?.data)

            const campaignURL = `https://graph.facebook.com/v18.0/${adAccountId}/campaigns?fields=${CAMPAIGN_FIELDS.join(
              ","
            )}&date_preset=${date_Preset}&access_token=${
              existingUser?.accessToken
            }`;
            const campaignResponse = await axios.get(campaignURL);
            console.log('campaignResponse',campaignResponse?.data?.data)

            const fetchAdSets = `https://graph.facebook.com/v18.0/${adAccountId}/adsets?fields=${ADSET_FIELDS}&date_preset=${date_Preset}&access_token=${existingUser?.accessToken}`;
            const adSetsResponse = await axios.get(fetchAdSets);

            console.log('insightResponse',insightResponse?.data?.data)
            const adSetId = insightResponse?.data?.data?.[i]?.adset_id;

            const adSetsURL = `https://graph.facebook.com/v18.0/${adSetId}?fields=${ADSET_LEVEL}&date_preset=${date_Preset}&access_token=${existingUser?.accessToken}`;
            const adSetResponse = await axios.get(adSetsURL);

            const adSetInsightURL = `https://graph.facebook.com/v18.0/${adSetId}/insights?breakdowns=${break_downs.join(
              ","
            )}&date_preset=${date_Preset}&time_increment=${time_Increment}&access_token=${
              existingUser?.accessToken
            }`;
            const adSetInsightResponse = await axios.get(adSetInsightURL);

            const accountURL = `https://graph.facebook.com/v18.0/${adAccountId}?fields=${ACCOUNT_LEVEL}&date_preset=${date_Preset}&access_token=${existingUser?.accessToken}`;
            const accountResponse = await axios.get(accountURL);

            const adCreativesURL = `https://graph.facebook.com/v18.0/${adAccountId}/adcreatives?fields=${AD_CREATIVES}&date_preset=${date_Preset}&access_token=${existingUser?.accessToken}`;
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
        } else {
          return res
            .status(500)
            .json({ data: {}, message: `Missing ads response ${adsURL}`, status: false });
        }
      } else {
        return res
        .status(500)
        .json({ data: {}, message: `Missing adAccountId`, status: false });
      }
    }
    }
    console.log("totalResponse", totalResponse);
    flattenedData = totalResponse.flatMap((item) => {
      const result = {};
      flattenObject(item, result);
      return result;
    });

    res.json({
      data: flattenedData.map((facebookConfig) =>
        facebookConfig.toObject({ getters: true })
      ),
      status: true,
      message: "CSV preview",
    });

    // });
  } catch (err) {
    console.log('I am here', err.message)
    return res.status(500).json({ data: {}, message: err, status: false });
  }

  return res
    .status(200)
    .json({ data: {}, message: "Generated succesfully", status: true });
};

exports.fetchFacebookDataForSingleConfigPreview =
  fetchFacebookDataForSingleConfigPreview;
