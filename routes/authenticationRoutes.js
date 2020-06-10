var express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
var nodemailer = require('nodemailer');
var router = express.Router();
var mainDB = require('../DAL/dbRepository');
const jwt = require('jsonwebtoken');

router.get('/restorePassword/:email', function (req, res) {
    const email = req.params['email'];
    restorePassword(email);
    res.send({ name: email });
});

router.post('/updatePassword', function (req, res) {
    console.log(req.body);

    mainDB.updatePassword(req.body, function (respone, err) {
        if (respone) {
            res.status(200).send(req.body);
        } else {
            res.status(400).send(err);
        }
    });
});

router.get('/login/:email/:password', function (req, res) {
    const email = req.params['email'];
    const password = req.params['password'];
    mainDB.login(email, password, function (result, err) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        } else {
            var user = {
                email: email,
                password: password
            }
            var token = jwt.sign({}, 'qwerasdfzxcv', {
                expiresIn: 60*60*2,
                subject: email
            });
            res.status(200).send({ user, token });
        }
    });
});

router.post('/register', function (req, res) {
    mainDB.register(req.body, function (result, err) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.status(200).send();
        }
    });
});

function restorePassword(email) {
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'sanadassdsad@gmail.com',
            pass: 'omer2803'
        }
    });

    var mailOptions = {
        from: 'sanadassdsad@gmail.com',
        to: email,
        subject: 'Forgot password',
        html: '<p>Click <a href="http://localhost:4200/restorePassword;email=' + email + '">here</a> to reset your password</p>'

    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = router;
