const express = require('express');

const monitorPipelineController = require('../../controllers/monitorPipeline/monitorPipeline');

const router = express.Router();

router.post('/', monitorPipelineController.getMonitorPipeline);

module.exports = router;