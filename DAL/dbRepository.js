var sql = require("mssql");
var config = require("./dbconfig");
var bcrypt = require('bcryptjs');
var currentExam;
const dbPool = new sql.ConnectionPool(config, err => {
    if (err) {
        console.log('dbPool Error: ' + err);
    }
});

class DBContext {
    login(email, password, callback) {
        var request = dbPool.request();
        request.input('Email', sql.VarChar(50), email);
        request.execute('spAdmins_login').then(function (req, err) {
            if (bcrypt.compareSync(password, req.recordset[0].Password)) {
                callback(req.recordset[0].Email);
            } else {
                console.log("error", "Execution error calling 'spAdmins_login'");
                callback(null, { message: 'Failed connection' });
            }
        });
    }

    register(admin, callback) {
        var request = dbPool.request();
        var hashpassword = bcrypt.hashSync(admin.password, 10);
        console.log({ hashpassword });
        console.log(admin.password);
        request.input('Email', sql.VarChar(50), admin.email);
        request.input('FirstName', sql.VarChar(50), admin.firstName);
        request.input('LastName', sql.VarChar(50), admin.lastName);
        request.input('Password', sql.VarChar(50), hashpassword);
        request.input('IsActive', sql.Bit, false);
        request.input('OrganizationId', sql.Int, null);

        request.execute('spAdmins_Insert').then(function (req, err) {
            if (err) {
                callback(null, { message: 'Error occured while registeration' })
            } else {
                callback(req);
            }
        });
    }

    updatePassword(admin, callback) {
        var request = dbPool.request();
        var hashpassword = bcrypt.hashSync(admin.password, 10);
        request.input('Password', sql.VarChar(150), hashpassword);
        request.input('Email', sql.VarChar(50), admin.email);
        request.execute('spAdmins_UpdatePassword').then(function (req, err) {
            if (err) {
                callback(null, { message: 'Error occured while creation test' })
            } else {
                callback(req);
            }
        });

    }

    createTest(test, callback) {
        var request = dbPool.request();
        request.input('Language', sql.VarChar(50), test.language);
        request.input('TestName', sql.VarChar(50), test.name);
        request.input('Instructions', sql.VarChar(50), test.instructions);
        request.input('Time', sql.Int, test.time);
        request.input('OwnerEmail', sql.VarChar(50), test.ownerEmail);
        request.input('PassingGrade', sql.Int, test.passingGrade);
        request.input('ReviewAnswers', sql.Bit, test.reviewAnswers);
        request.input('LastUpdate', sql.Date, new Date());
        request.input('DiplomaURL', sql.VarChar(50), null);
        request.input('Field', sql.VarChar(50), test.field);
        request.input('MessageOnSuccess', sql.VarChar(100), test.msgSuccess);
        request.input('MessageOnFailure', sql.VarChar(100), test.msgFailure);
        request.execute('spTests_Insert').then(function (req, err) {
            if (req) {
                callback(req.returnValue);
            } else if (err) {
                callback(null, { message: 'Error occured ' })
            }
        });
    }

    getTestById(testId, field, callback) {
        var request = dbPool.request();
        request.input('Id', sql.Int, testId);
        request.input('Field', sql.VarChar(50), field);
        request.execute('spTests_GetById').then(function (req, err) {
            if (err) {
                callback(null, { message: "Execution error calling 'spTests_GetByField'" })
            } else {
                console.log(req.recordsets);

                callback(req.recordsets);
            }
        });
    }

    getTestsByField(field, callback) {
        var request = dbPool.request();
        request.input('Field', sql.NVarChar(50), field);
        request.execute('spTests_GetByField').then(function (req, err) {
            if (err) {
                callback(null, { message: "Execution error calling 'spTests_GetByField'" })
            } else {
                console.log(req.recordset);

                callback(req.recordset);
            }
        });
    }

    addQuestionsToTest(questions, testId, callback) {
        for (let index = 0; index < questions.length; index++) {
            var request = dbPool.request();
            request.input('TestId', sql.Int, testId);
            console.log(questions[index]);

            request.input('QuestionId', sql.Int, questions[index]);
            request.execute('spQuestionForTest_Insert').then(function (test) {
                continue;
            }).catch(function (err) {
                console.log(err);
            });

        }
        callback({ message: 'succes' });
    }

    /**
     * Add question to db
     * @param {*response function} callback 
     */
    addQuestion(question, callback) {
        var request = dbPool.request();
        request.input('Title', sql.VarChar(50), question.Title);
        request.input('QuestionType', sql.VarChar(50), question.QuestionType);
        request.input('QuestionContent', sql.VarChar(50), question.QuestionContent);
        request.input('Active', sql.Bit, false);
        request.input('LastUpdate', sql.Date, question.LastUpdate);
        request.input('Field', sql.NVarChar(50), question.Field);
        request.input('Layout', sql.NVarChar(50), question.Layout);
        request.input('tags', sql.NVarChar(50), question.tags);

        request.execute('spQuestions_INSERT').then(function (req, err) {
            if (err) {
                callback(null, { message: "Execution error calling 'spQuestions_INSERT'" })
            } else {
                callback(req);
            }
        });
    }

    /**
     * edit an existing question in db
     * @param {*response function} callback 
     */
    editQuestion(question, callback) {
        var request = dbPool.request();
        request.input('QuestionId', sql.Int, question.ID);
        request.input('Title', sql.VarChar(50), question.Title);
        request.input('QuestionType', sql.VarChar(50), question.QuestionType);
        request.input('QuestionContent', sql.VarChar(50), question.QuestionContent);
        request.input('Active', sql.Bit, false);
        request.input('LastUpdate', sql.Date, question.LastUpdate);
        request.input('Field', sql.NVarChar(50), question.Field);
        request.input('Layout', sql.NVarChar(50), question.Layout);
        request.input('tags', sql.NVarChar(50), question.tags);

        request.execute('spQuestions_Update').then(function (req, err) {
            if (err) {
                callback(null, { message: "Execution error calling 'spQuestions_Update'" })
            } else {
                callback(req);
            }
        });
    }

    getExamResult(userId, callback) {
        var request = dbPool.request();
        request.input('UserID', sql.Int, userId);
        request.execute('spExams_GetExamResult').then(function (req, err) {
            if (err) {
                callback(null, { message: "Execution error calling 'spExams_GetExamResult'" })
            } else {
                callback(req.recordset);
            }
        });

    }

    /**
     * edit an existing answer in db
     * @param {*response function} callback 
     */
    editAnswer(answer, callback) {
        var request = dbPool.request();
        request.input('QuestionId', sql.Int, answer.QuestionId)
        request.input('CorrectAnswer', sql.Bit, answer.CorrectAnswer)
        request.input('Info', sql.NVarChar(50), answer.Info)
        request.input('ID', sql.Int, answer.ID)

        request.execute('spAnswers_Update').then(function (req, err) {
            if (err) {
                callback(null, { message: "Execution error calling 'spAnswers_Update'" })
            } else {
                callback(req);
            }
        });
    }

    getExam(id, callback) {
        var request = dbPool.request();
        request.input('TestID', sql.Int, id);
        request.execute('spExams_GetByID').then(function (req, err) {
            if (err) {
                callback(null, { message: "Execution error calling 'spExams_GetByID'" })
            } else {
                callback(req.recordsets);
            }
        });
    }

    /**
     * get question from db by id
     */
    getQuestionById(id, callback) {
        var request = dbPool.request();
        request.input('QuestionId', sql.Int, id);
        request.execute('spQuestion_GetById').then(function (req, err) {
            if (err) {
                callback(null, { message: "Execution error calling 'spQuestion_GetById'" })
            } else {
                callback(req.recordsets);
            }
        });
    }

    generateReport(report, callback) {
        var request = dbPool.request();
        request.input('TestId', sql.Int, report.TestId);
        request.input('UserId', sql.Int, report.UserId);
        request.input('DeliveryDate', sql.Date, report.DeliveryDate);
        request.input('QuestionsSent', sql.Int, report.QuestionsSent);
        request.input('Grade', sql.Int, report.Grade);
        request.execute('spReports_Insert').then(function (req, err) {
            if (err) {
                callback(null, { message: "Execution error calling 'spReports_Insert" })
            } else {
                callback(req);
            }
        });
    }

    saveAnswer(answer, callback) {
        var request = dbPool.request();
        request.input('QuestionId', sql.Int, answer.questionID);
        request.input('UserId', sql.Int, answer.userID);
        request.input('AnswerId', sql.Int, answer.answerID);
        request.execute('spExams_SaveAnswer').then(function (req, err) {
            if (err) {
                callback(null, { message: "Execution error calling 'spExams_SaveAnswer" })
            } else {
                console.log(req);

                callback(req);
            }
        });
    }



    /**
     * Add answer to db
     * @param {*response function} callback 
     */
    addAnswer(answer, callback) {
        console.log('ans in repo: ' + answer.QuestionId);
        var request = dbPool.request();
        request.input('QuestionId', sql.Int, answer.QuestionId);
        request.input('CorrectAnswer', sql.Bit, answer.CorrectAnswer);
        request.input('Info', sql.VarChar(50), answer.Info);

        request.execute('spAnswers_Insert').then(function (req, err) {
            if (err) {
                callback(null, { message: "Execution error calling 'spAnswers_Insert'" })
            } else {
                console.log('add ans in db: ' + req);
                callback(req);
            }
        });
    }

    /**
     * get all questions
     * @param {*} callback 
     */
    getQuestions(field, min, max, callback) {
        var req = dbPool.request();
        req.input('Field', sql.NVarChar(50), field);
        req.input('MinId', sql.Int, min);
        req.input('MaxId', sql.Int, max);
        req.execute('spQuestions_GetByField').then(function (req, err) {
            if (err) {
                callback(null, { message: "Exec error calling 'spQuestions_GetAll'" })
            } else {
                console.log(req.recordset);

                callback(req.recordset);
            }
        });
    }

    /**
     * delete question
     * @param {*} callback 
     */
    deleteQuestion(questionId, callback) {
        var req = dbPool.request();
        req.input('QuestionId', sql.Int, questionId);
        req.execute('spQuestions_Delete').then(function (req, err) {
            if (err) {
                callback(null, { message: "Exec error calling 'spQuestions_Delete'" })
            } else {
                callback(req.recordset);
            }
        });
    }

    /**
     * delete answers
     * @param {*} callback 
     */
    deleteAnswers(questionId, callback) {
        var req = dbPool.request();
        req.input('QuestionId', sql.Int, questionId);
        req.execute('spAnswers_Delete').then(function (req, err) {
            if (err) {
                callback(null, { message: "Exec error calling 'spAnswers_Delete'" })
            } else {
                callback(req);
            }
        });
    }

    /**
     * get answers of specific question
     * @param {*} callback 
     */
    getAnswers(questionId, callback) {
        var req = dbPool.request();
        req.input('QuestionId', sql.Int, questionId);
        req.execute('spAnswers_GetByQuestionId').then(function (req, err) {
            if (err) {
                callback(null, { message: "Exec error calling 'spAnswers_GetByQuestionId'" })
            } else {
                callback(req.recordset);
            }
        });
    }

    /**
     * get all tests
     * @param {function to get result} callback 
     */
    getTests(callback) {
        var req = dbPool.request();

        req.execute("spTests_GetAll", (err, data) => {
            if (err) {
                throw new Error("Exec error calling 'spTests_GetAll'");
            }

            callback(data.recordset);
        });
    }
}

module.exports = new DBContext();
