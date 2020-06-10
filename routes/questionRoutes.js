var express = require('express');
var router = express.Router();
var mainDB = require('../DAL/dbRepository');
const authorize = require('../middlewares/authorize');

router.post('/createQuestion', function (req, res) {
    mainDB.addQuestion(req.body, function (result, err) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.status(200).send(result.returnValue.toString());
        }
    });
});

router.put('/editQuestion', function (req, res) {
    mainDB.editQuestion(req.body, function (result, err) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.status(200).send(result.returnValue.toString());
        }
    });
});

router.put('/editAnswer', function (req, res) {
    mainDB.editAnswer(req.body, function (result, err) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.status(200).send(result.returnValue.toString());
        }
    });
});

router.post('/createAnswer', function (req, res) {
    console.log('in ans route: ');
    console.log(req.body);
    mainDB.addAnswer(req.body, function (result, err) {
        if (err) {
            res.status(400).send(err);
        } else {
            console.log('in ans route');
            res.status(200).send();
        }
    });
});

router.delete('/deleteAnswers/:questionId', function (req, res) {
    const questionId = req.params['questionId'];
    mainDB.deleteAnswers(questionId, function (result, err) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.status(200).send(result);
        }
    });
});

router.delete('/deleteQuestion/:questionId', function (req, res) {
    const questionId = req.params['questionId'];
    mainDB.deleteQuestion(questionId, function (result, err) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.status(200).send(result);
        }
    });
});

router.get('/getQuestions/:field/:min/:max', function (req, res) {
    const field = req.params['field'];
    const min = req.params['min'];
    const max = req.params['max'];
    mainDB.getQuestions(field, min, max, function (result, err) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        } else {
            res.status(200).send(result);
        }
    });
});

router.get('/getQuestionById/:quesId', function (req, res) {
    const quesID = req.params['quesId'];
    mainDB.getQuestionById(quesID, function (result, error) {
        if (result) {
            res.status(200).send(result);
        } else if (error) {
            res.status(400).send(error);
        }
    })
});

router.get('/getAnswers/:questionId', function (req, res) {
    const questionId = req.params['questionId'];
    mainDB.getAnswers(questionId, function (result, err) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.status(200).send(result);
        }
    });
});

router.get('/tests', function (req, res, next) {
    mainDB.getTests(data => {
        res.json(data);
    })
});

module.exports = router;
