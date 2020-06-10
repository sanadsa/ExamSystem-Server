var express = require('express');
var router = express.Router();
var reportRepository = require('../DAL/reportRepository');

router.get('/getReportsByTest/:testId/:fromDate/:toDate', function (req, res) {
    const testId = req.params['testId'];
    const fromDate = req.params['fromDate'];
    const toDate = req.params['toDate'];
    reportRepository.getReports(testId, fromDate, toDate, function (result, err) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.status(200).send(result);
        }
    });
});

module.exports = router;