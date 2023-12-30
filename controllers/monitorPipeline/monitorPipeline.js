const MonitorPipeline = require("../../models/monitorPipeline/monitorPipeline");

const getMonitorPipeline = async (req, res, next) => {
  const { userId } = req.body;
  if (!userId) {
    return res
    .status(401)
    .json({ data: {}, message: `Missing userId`, status: false });
  }
  try {
    const monitorPipelines = await MonitorPipeline.find({ userId: userId });
    const sortedList = monitorPipelines.sort((a, b) => b.createdAt - a.createdAt);
    res.json({
      data: sortedList,message: "Logs fetched successfully", status: true 
    });
  } catch (err) {
    return res
    .status(500)
    .json({ data: {}, message: "Something went wrong", status: false });
  }
};

exports.getMonitorPipeline = getMonitorPipeline;