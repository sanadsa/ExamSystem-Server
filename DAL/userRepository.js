var sql = require("mssql");
var config = require("./dbconfig");
const dbPool = new sql.ConnectionPool(config, err => {
    if (err) {
        console.log('dbPool Error: ' + err);
    }
});


class DBContext {
    /**
     * Add user to db
     * @param {*response function} callback 
     */
    addUser(user, callback) {
        console.log("in add user repo");
        console.log(user);
        var request = dbPool.request();
        request.input('FirstName', sql.VarChar(250), user.firstName);
        request.input('LastName', sql.VarChar(250), user.lastName);
        request.input('Email', sql.VarChar(250), user.email);
        request.input('Phone', sql.VarChar(50), user.phone);

        request.execute('spUsers_Insert').then(function (req, err) {
            if (err) {
                callback(null, { message: "Execution error calling '[spUsers_Insert]'" })
            } else {
                callback(req.recordset[0]);
            }
        });
    }
}

module.exports = new DBContext();