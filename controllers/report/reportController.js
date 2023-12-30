const { ObjectId } = require("mongodb");

const HttpError = require("../../models/httpError");
const Report = require("../../models/report/report");

const getAllReportData = async (req, res, next) => {
  try {
    const facebookConfigs = await Report.find();
    res.json({
      facebookConfig: facebookConfigs,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ data: {}, message: "No report found", status: false });
  }
};

const getReportData = async (req, res, next) => {
  const { userId } = req.body;
  if (!userId) {
    return res
    .status(401)
    .json({ data: {}, message: `Missing userId`, status: false });
  }
  try {
    const facebookConfigs = await Report.find({ userId: userId });
    res.json({
      facebookConfig: facebookConfigs,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ data: {}, message: "No report found", status: false });
  }
};

const saveReport = async (req, res, next) => {
  const { name, url, userId } = req.body;
  if (!userId || !name || !url) {
    return res
    .status(401)
    .json({ data: {}, message: `Missing userId`, status: false });
  }
  try {
    const createConfig = new Report({
      name,
      url,
      userId,
    });

    await createConfig.save();
  } catch (err) {
    return res
      .status(500)
      .json({ data: {}, message: "Something went wrong!!", status: false });
  }

  return res.json({ message: "Report saved successfully", status: true });
};

const deleteReport = async (req, res, next) => {
  const { id } = req.body;
  if (!id) {
    return res
    .status(401)
    .json({ data: {}, message: `Missing id`, status: false });
  }
  const query = { _id: new ObjectId(id) };

  try {
    const result = await Report.deleteOne(query);
    if (result.deletedCount === 1) {
      return res.json({
        message: "Document deleted successfully",
        status: true,
      });
    } else {
      return res.json({ message: "Document not found", status: fasle });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ data: {}, message: "Something went wrong", status: false });
  }
};

const updateReport = async (req, res, next) => {
  const { id, name, url, userId } = req.body;
  if (!userId || !id || !name || !url) {
    return res
    .status(401)
    .json({ data: {}, message: `Missing userId`, status: false });
  }
  const newData = {
    $set: {
      name,
      url,
      userId,
    },
  };

  const query = { _id: new ObjectId(id) };

  try {
    const result = await Report.updateOne(query, newData);
    if (result.modifiedCount === 1) {
      return res.json({ config: "Config updated successfully", status: true });
    } else {
      return res.json({
        config: "Document not found or not modified",
        status: false,
      });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ data: {}, message: "Something went wrong", status: false });
  }
};

exports.saveReport = saveReport;
exports.getReportData = getReportData;
exports.deleteReport = deleteReport;
exports.updateReport = updateReport;
exports.getAllReportData = getAllReportData;
