var express = require('express');
var router = express.Router();
var userRepository = require('../DAL/userRepository');

router.post('/createUser', function (req, res) {
    console.log(req.body);
    userRepository.addUser(req.body, function (result, err) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.status(200).send(result);
        }
    });
});

module.exports = router;