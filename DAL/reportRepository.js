var sql = require("mssql");
var config = require("./dbconfig");
const dbPool = new sql.ConnectionPool(config, err => {
    if (err) {
        console.log('dbPool Error: ' + err);
    }
});

class DBContext {
    /**
     * get reports
     * @param {*response function} callback 
     */
    getReports(testId, fromDate, toDate, callback) {
        var req = dbPool.request();
        req.input('TestId', sql.Int, testId);
        req.input('FromDate', sql.Date, fromDate);
        req.input('ToDate', sql.Date, toDate);
        req.execute('spReports_GetByTest').then(function (req, err) {
            if (err) {
                callback(null, { message: "Exec error calling 'spReports_GetByTest'" })
            } else {
                callback(req.recordset);
            }
        });
    }
}

module.exports = new DBContext();