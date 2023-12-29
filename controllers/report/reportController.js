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
    const error = new HttpError("No report found", 500);
    return next(error);
  }
};

const getReportData = async (req, res, next) => {
  const { userId } = req.body;
  try {
    const facebookConfigs = await Report.find({ userId: userId });
    res.json({
      facebookConfig: facebookConfigs,
    });
  } catch (err) {
    const error = new HttpError("No report found", 500);
    return next(error);
  }
};

const saveReport = async (req, res, next) => {
  const { name, url, userId } = req.body;

  try {
    const createConfig = new Report({
      name,
      url,
      userId
    });

    await createConfig.save();
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  return res.json({ config: "Config saved successfully" });
};

const deleteReport = async (req, res, next) => {
  const { id } = req.body;

  const query = { _id: new ObjectId(id) };

  try {
    const result = await Report.deleteOne(query);
    if (result.deletedCount === 1) {
      return res.json({ message: "Document deleted successfully" });
    } else {
      return res.json({ message: "Document not found" });
    }
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }
};

const updateReport = async (req, res, next) => {
  const { id, name, url, userId } = req.body;

  const newData = {
    $set: {
      name,
      url,
      userId
    },
  };

  const query = { _id: new ObjectId(id) };

  try {
    const result = await Report.updateOne(query, newData);
    if (result.modifiedCount === 1) {
      return res.json({ config: "Config updated successfully" });
    } else {
      return res.json({ config: "Document not found or not modified" });
    }
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }
};

exports.saveReport = saveReport;
exports.getReportData = getReportData;
exports.deleteReport = deleteReport;
exports.updateReport = updateReport;
exports.getAllReportData = getAllReportData;
