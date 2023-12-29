const express = require('express');

const reportController = require('../../controllers/report/reportController');

const router = express.Router();

router.post('/create', reportController.saveReport);
router.post('/delete', reportController.deleteReport);
router.post('/update', reportController.updateReport);
router.post('/all', reportController.getAllReportData);
router.post('/', reportController.getReportData);

module.exports = router;