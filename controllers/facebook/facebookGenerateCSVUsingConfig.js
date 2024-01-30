const axios = require("axios");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const cron = require("node-cron");
const fs = require("fs");
const { BlobServiceClient, ContainerClient } = require("@azure/storage-blob");
const { ObjectId } = require("mongodb");

const FacebookCredential = require("../../models/facebook/facebookCredential");
const HttpError = require("../../models/httpError");

const FacebookConfig = require("../../models/facebook/facebookConfig");
const MonitorPipeline = require("../../models/monitorPipeline/monitorPipeline");

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

const fetchFacebookDataForAdvertisement = async (req, res, next) => {
  let existingUser;
  let facebookConfigs;
  let totalResponse = [];
  let flattenedData = [];
  facebookConfigs = await FacebookConfig.find();
  try {
    for (let i = 0; i < facebookConfigs.length; i++) {
      console.log("I am calling", facebookConfigs[i].cron);
      // cron.schedule('* * * * *', async () => {
      const datePreset = facebookConfigs[i].datePreset
        ? facebookConfigs[i].datePreset.label
        : "last_30d";
      const timeIncrement = facebookConfigs[i].timeIncrement
        ? facebookConfigs[i].timeIncrement.label
        : "all_days";
      const breakdowns = facebookConfigs[i].breakdowns.map(
        (item) => item.label
      );

      const INSIGHT_FIELDS = facebookConfigs[i].selectedAdInsights.map(
        (item) => item.label
      );
      const CAMPAIGN_FIELDS = facebookConfigs[i].selectedAdSetFields.map(
        (item) => item.label
      );
      const ADSET_LEVEL = facebookConfigs[i].selectedAdSetLevel.map(
        (item) => item.label
      );
      const ADSET_FIELDS = facebookConfigs[i].selectedAdSetFields.map(
        (item) => item.label
      );
      const ACCOUNT_LEVEL = facebookConfigs[i].selectedAccountLevel.map(
        (item) => item.label
      );
      const AD_CREATIVES = facebookConfigs[i].selectedCreativeLevel.map(
        (item) => item.label
      );
      existingUser = await FacebookCredential.findOne({
        userId: facebookConfigs[i].userId,
      });
      if (!existingUser) {
        return res
          .status(500)
          .json({ data: {}, message: `Wrong user`, status: false });
      }
      for(let accountCounter = 0;accountCounter< facebookConfigs[i]?.account.length; accountCounter++){
      const adAccountId = facebookConfigs[i]?.account[accountCounter]?.value;
      if (adAccountId) {
        const adsURL = `https://graph.facebook.com/v18.0/${adAccountId}/ads?access_token=${existingUser?.accessToken}`;
        const adsResponse = await axios.get(adsURL);

        if (adsResponse?.data?.data.length > 0) {
          console.log('adsResponse?.data?.data', adsResponse?.data?.data)
          //adsIndex < adsResponse?.data?.data.length;
          for (let adsIndex = 0; adsIndex < adsResponse?.data?.data.length; adsIndex++) {
            const adId = adsResponse?.data?.data[i]?.id;
            const insightURL = `https://graph.facebook.com/v18.0/${adId}/insights?fields=${INSIGHT_FIELDS.join(
              ","
            )}&date_preset=${datePreset}&time_increment=${timeIncrement}&breakdowns=${breakdowns.join(
              ","
            )}&access_token=${existingUser?.accessToken}`;
            console.log("insightURL", insightURL);
            const insightResponse = await axios.get(insightURL);
            console.log("insightResponse", insightResponse);

            const campaignURL = `https://graph.facebook.com/v18.0/${adAccountId}/campaigns?fields=${CAMPAIGN_FIELDS.join(
              ","
            )}&date_preset=${datePreset}&access_token=${
              existingUser?.accessToken
            }`;
            const campaignResponse = await axios.get(campaignURL);

            const fetchAdSets = `https://graph.facebook.com/v18.0/${adAccountId}/adsets?fields=${ADSET_FIELDS}&date_preset=${datePreset}&access_token=${existingUser?.accessToken}`;
            const adSetsResponse = await axios.get(fetchAdSets);

            const adSetId = insightResponse?.data?.data?.[i]?.adset_id;
            if (!adSetId) {
              return res
                .status(500)
                .json({ data: {}, message: `Missing adSetId`, status: false });
            }

            const adSetsURL = `https://graph.facebook.com/v18.0/${adSetId}?fields=${ADSET_LEVEL}&date_preset=${datePreset}&access_token=${existingUser?.accessToken}`;
            const adSetResponse = await axios.get(adSetsURL);

            const adSetInsightURL = `https://graph.facebook.com/v18.0/${adSetId}/insights?breakdowns=${breakdowns.join(
              ","
            )}&date_preset=${datePreset}&time_increment=${timeIncrement}&access_token=${
              existingUser?.accessToken
            }`;
            const adSetInsightResponse = await axios.get(adSetInsightURL);
            console.log("adSetInsightURL", adSetInsightURL);
            console.log("adSetInsightResponse", adSetInsightResponse);

            const accountURL = `https://graph.facebook.com/v18.0/${adAccountId}?fields=${ACCOUNT_LEVEL}&date_preset=${datePreset}&access_token=${existingUser?.accessToken}`;
            const accountResponse = await axios.get(accountURL);

            const adCreativesURL = `https://graph.facebook.com/v18.0/${adAccountId}/adcreatives?fields=${AD_CREATIVES}&date_preset=${datePreset}&access_token=${existingUser?.accessToken}`;
            const adCreativesResponse = await axios.get(adCreativesURL);

            console.log("did i reach here??");
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
            .json({
              data: {},
              message: `No response in ${adsURL}`,
              status: false,
            });
        }
      } else {
        return res
          .status(500)
          .json({ data: {}, message: `Missing adAccountId`, status: false });
      }
    }
      console.log("totalResponse", totalResponse);
      flattenedData = totalResponse.flatMap((item) => {
        const result = {};
        flattenObject(item, result);
        return result;
      });
      const columnHeaders = Array.from(
        new Set(flattenedData.flatMap((item) => Object.keys(item)))
      );

      const fileName = `${facebookConfigs[i].configName}_${
        existingUser?.name
      }_${new Date().getTime()}.csv`;
      console.log("did i reach here??", fileName);

      const csvWriter = createCsvWriter({
        path: fileName, // Output file path
        header: columnHeaders.map((header) => ({
          id: header,
          title: header,
        })),
      });

      csvWriter
        .writeRecords(flattenedData)
        .then(() => {
          console.log("CSV file written successfully");

          const storageAccount = "https://facebookadscsv.blob.core.windows.net";
          const storageAccessKey =
            "kXDynJPx+tTsnkvrWVI0eHvfxddEO0QXsF9sxK2lmHGnHR/adHWhTlbDDwgNFt+C7ePtNWl3qsqO+AStPHnzxw==";
          const containerName = "beigebananas";
          const accountName = "facebookadscsv";
          const accountKey =
            "kXDynJPx+tTsnkvrWVI0eHvfxddEO0QXsF9sxK2lmHGnHR/adHWhTlbDDwgNFt+C7ePtNWl3qsqO+AStPHnzxw==";

          uploadToAzureStorage(
            storageAccount,
            storageAccessKey,
            containerName,
            fileName,
            accountName,
            accountKey,
            facebookConfigs[i]
          );
        })
        .catch((error) => console.error("Error writing CSV file:", error));
      // });
    }
  } catch (err) {}

  return "Generated succesfully";
};

const uploadToAzureStorage = async (
  accountUrl,
  storageAccessKey,
  containerName,
  path,
  accountName,
  accountKey,
  configData
) => {
  const localFilePath = path;

  // Azure Storage Blob URL
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    `DefaultEndpointsProtocol=https;AccountName=${accountName};AccountKey=${accountKey};EndpointSuffix=core.windows.net`
  );
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobName = path;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  try {
    // Read the local file content
    const data = fs.readFileSync(localFilePath);

    // Upload the file to Azure Storage Blob
    await blockBlobClient.upload(data, data.length);
    const blobUrl = blockBlobClient.url;
    await saveMonitorPipeline({
      name: configData?.configName,
      account: configData?.account,
      status: "Successful",
      message: "CSV generated and uploaded successfully",
      filePath: blobUrl,
      createdAt: new Date().getTime(),
      userId: configData.userId,
      configDays: configData?.configDays,
      selectedDays: configData?.selectedDays,
      cron: configData?.cron,
    });
    console.log(
      `File "${blobName}" uploaded to Azure Storage Blob successfully.`
    );
    console.log("Blob URL:", blobUrl);

    console.log(
      `File "${blobName}" uploaded to Azure Storage Blob successfully.`
    );
  } catch (error) {
    await saveMonitorPipeline({
      name: configData?.configName,
      account: configData?.account,
      status: "UnSuccessful",
      message: error.message,
      filePath: "NA",
      createdAt: new Date().getTime(),
      userId: configData.userId,
      configDays: configData?.configDays,
      selectedDays: configData?.selectedDays,
      cron: configData?.cron,
    });
    console.error("Error uploading file to Azure Storage Blob:", error.message);
  }
};

const saveMonitorPipeline = async (payload) => {
  try {
    console.log(payload, "payload");
    const monitorPipeline = new MonitorPipeline(payload);

    await monitorPipeline.save();
  } catch (err) {
    console.log(err);
    // const error = new HttpError(err, 500);
    // return next(error);
  }

  // return res.json({ config: "Monitor Pipeline saved successfully" });
};

const fetchFacebookDataForSingleConfig = async (req, res, next) => {
  const { id } = req.body;
  const query = { _id: new ObjectId(id) };
  if (!id) {
    return res
      .status(401)
      .json({ data: {}, message: `Missing id`, status: false });
  }

  let existingUser;
  let totalResponse = [];
  let flattenedData = [];
  const facebookConfigs = await FacebookConfig.find(query);
  try {
    for (let i = 0; i < facebookConfigs.length; i++) {
      console.log("I am calling", facebookConfigs[i].cron);
      // cron.schedule('* * * * *', async () => {
      const datePreset = facebookConfigs[i].datePreset
        ? facebookConfigs[i].datePreset.label
        : "last_30d";
      const timeIncrement = facebookConfigs[i].timeIncrement
        ? facebookConfigs[i].timeIncrement.label
        : "all_days";
      const breakdowns = facebookConfigs[i].breakdowns.map(
        (item) => item.label
      );

      const INSIGHT_FIELDS = facebookConfigs[i].selectedAdInsights.map(
        (item) => item.label
      );
      const CAMPAIGN_FIELDS = facebookConfigs[i].selectedCampaignInsights.map(
        (item) => item.label
      );
      const ADSET_LEVEL = facebookConfigs[i].selectedAdSetLevel.map(
        (item) => item.label
      );
      const ADSET_FIELDS = facebookConfigs[i].selectedAdSetFields.map(
        (item) => item.label
      );
      const ACCOUNT_LEVEL = facebookConfigs[i].selectedAccountLevel.map(
        (item) => item.label
      );
      const AD_CREATIVES = facebookConfigs[i].selectedCreativeLevel.map(
        (item) => item.label
      );
      existingUser = await FacebookCredential.findOne({
        userId: facebookConfigs[i].userId,
      });
      if (!existingUser) {
        const error = new HttpError("Wrong user", 403);
        return next(error);
      }

      for(let accountCounter = 0;accountCounter< facebookConfigs[i]?.account.length; accountCounter++){

      
      const adAccountId = facebookConfigs[i]?.account[accountCounter]?.value;

      console.log('adAccountId', adAccountId, facebookConfigs[i]?.account)
      if (adAccountId) {
        const adsURL = `https://graph.facebook.com/v18.0/${adAccountId}/ads?access_token=${existingUser?.accessToken}`;
        const adsResponse = await axios.get(adsURL);

        if (adsResponse?.data?.data.length > 0) {
          //adsIndex < adsResponse?.data?.data.length;
          console.log('adsResponse?.data?.data', adsResponse?.data?.data)
          for (let adsIndex = 0; adsIndex < 1; adsIndex++) {
            const adId = adsResponse?.data?.data[i]?.id;
            const insightURL = `https://graph.facebook.com/v18.0/${adId}/insights?fields=${INSIGHT_FIELDS.join(
              ","
            )}&date_preset=${datePreset}&time_increment=${timeIncrement}&breakdowns=${breakdowns.join(
              ","
            )}&access_token=${existingUser?.accessToken}`;
            console.log("insightURL", insightURL);
            const insightResponse = await axios.get(insightURL);
            // console.log('insightResponse',insightResponse?.data?.data)

            const campaignURL = `https://graph.facebook.com/v18.0/${adAccountId}/campaigns?fields=${CAMPAIGN_FIELDS.join(
              ","
            )}&date_preset=${datePreset}&access_token=${
              existingUser?.accessToken
            }`;
            const campaignResponse = await axios.get(campaignURL);
            console.log("campaignURL", campaignURL);
            // console.log('campaignResponse',campaignResponse?.data?.data)

            const fetchAdSets = `https://graph.facebook.com/v18.0/${adAccountId}/adsets?fields=${ADSET_FIELDS}&date_preset=${datePreset}&access_token=${existingUser?.accessToken}`;
            console.log("campaignURL", campaignURL);

            const adSetsResponse = await axios.get(fetchAdSets);
            console.log("fetchAdSets >>>", fetchAdSets);
            // console.log('adSetsResponse',adSetsResponse?.data?.data)

            const adSetId = insightResponse?.data?.data?.[i]?.adset_id;
            console.log("adSetId", adSetId, insightResponse?.data?.data);
            const adSetsURL = `https://graph.facebook.com/v18.0/${adSetId}?fields=${ADSET_LEVEL}&date_preset=${datePreset}&access_token=${existingUser?.accessToken}`;
            console.log("adSetsURL", adSetsURL);
            const adSetResponse = await axios.get(adSetsURL);

            const adSetInsightURL = `https://graph.facebook.com/v18.0/${adSetId}/insights?breakdowns=${breakdowns.join(
              ","
            )}&date_preset=${datePreset}&time_increment=${timeIncrement}&access_token=${
              existingUser?.accessToken
            }`;
            const adSetInsightResponse = await axios.get(adSetInsightURL);
            console.log("adSetInsightURL", adSetInsightURL);
            // console.log('adSetInsightResponse',adSetInsightResponse?.data?.data)

            const accountURL = `https://graph.facebook.com/v18.0/${adAccountId}?fields=${ACCOUNT_LEVEL}&date_preset=${datePreset}&access_token=${existingUser?.accessToken}`;
            const accountResponse = await axios.get(accountURL);
            console.log("accountURL", accountURL);
            console.log("accountResponse", accountResponse?.data?.data);

            const adCreativesURL = `https://graph.facebook.com/v18.0/${adAccountId}/adcreatives?fields=${AD_CREATIVES}&date_preset=${datePreset}&access_token=${existingUser?.accessToken}`;
            const adCreativesResponse = await axios.get(adCreativesURL);
            console.log("adCreativesURL", adCreativesURL);
            // console.log('adCreativesResponse',adCreativesResponse?.data?.data)

            console.log("did i reach here??");
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
                  console.log("Pls count me");
                  for (
                    let adSetsResponseIndex = 0;
                    adSetsResponseIndex < adSetsResponse?.data?.data.length > 0;
                    adSetsResponseIndex++
                  ) {
                    if (
                      adSetsResponse?.data?.data[adSetsResponseIndex].id ===
                      insightResponse?.data?.data[insightResponseIndex].adset_id
                    ) {
                      console.log("Sexy lady on floor");

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
    }
      console.log("totalResponse", totalResponse);
      flattenedData = totalResponse.flatMap((item) => {
        const result = {};
        flattenObject(item, result);
        return result;
      });
      const columnHeaders = Array.from(
        new Set(flattenedData.flatMap((item) => Object.keys(item)))
      );

      const fileName = `${facebookConfigs[i].configName}_${
        existingUser?.name
      }_${new Date().getTime()}.csv`;
      console.log("did i reach here??", fileName);

      const csvWriter = createCsvWriter({
        path: fileName, // Output file path
        header: columnHeaders.map((header) => ({
          id: header,
          title: header,
        })),
      });

      csvWriter
        .writeRecords(flattenedData)
        .then(() => {
          console.log("CSV file written successfully");

          const storageAccount = "https://facebookadscsv.blob.core.windows.net";
          const storageAccessKey =
            "kXDynJPx+tTsnkvrWVI0eHvfxddEO0QXsF9sxK2lmHGnHR/adHWhTlbDDwgNFt+C7ePtNWl3qsqO+AStPHnzxw==";
          const containerName = "beigebananas";
          const accountName = "facebookadscsv";
          const accountKey =
            "kXDynJPx+tTsnkvrWVI0eHvfxddEO0QXsF9sxK2lmHGnHR/adHWhTlbDDwgNFt+C7ePtNWl3qsqO+AStPHnzxw==";

          uploadToAzureStorage(
            storageAccount,
            storageAccessKey,
            containerName,
            fileName,
            accountName,
            accountKey,
            facebookConfigs[i]
          );
        })
        .catch((error) => {
          return res
            .status(500)
            .json({ data: {}, message: error, status: false });
        });

      // });
    }
  } catch (err) {
    return res.status(500).json({ data: {}, message: err, status: false });
  }

  return res
    .status(200)
    .json({ data: {}, message: "Generated succesfully", status: true });
};

exports.fetchFacebookDataForAdvertisement = fetchFacebookDataForAdvertisement;
exports.saveMonitorPipeline = saveMonitorPipeline;
exports.uploadToAzureStorage = uploadToAzureStorage;
exports.fetchFacebookDataForSingleConfig = fetchFacebookDataForSingleConfig;
