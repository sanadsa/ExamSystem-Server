const jwt = require('jsonwebtoken');

exports.admin = function(req, res, next) {
    const token = req.header('admin_token');
    if (!token) return res.status(401).send('Unauthorized');

    try {
        const decoded = jwt.verify(token, 'qwerasdfzxcv');
        console.log({decoded});
        req.next();
    } catch(e) {
        console.log("FAIL");
        res.status(401).send('Invalid Token');
    }
};