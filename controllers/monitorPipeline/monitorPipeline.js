const HttpError = require("../../models/httpError");
const MonitorPipeline = require("../../models/monitorPipeline");

const getMonitorPipeline = async (req, res, next) => {
  const { userId } = req.body;
  try {
    const monitorPipelines = await MonitorPipeline.find({ userId: userId });
    res.json({
      data: monitorPipelines.map((monitorPipeline) =>
        monitorPipeline.toObject({ getters: true })
      ),
    });
  } catch (err) {
    const error = new HttpError("No log found", 500);
    return next(error);
  }
};

exports.getMonitorPipeline = getMonitorPipeline;
