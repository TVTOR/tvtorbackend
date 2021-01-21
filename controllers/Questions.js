var Ouestions = require(`${appRoot}/models/Question`);
var utilServices = require(`${appRoot}/services/Util`);
var Location = require(`${appRoot}/models/Locations`);
var Subject = require(`${appRoot}/models/Subjects`);
const { constants } = require(`${appRoot}/lib/constants`);
const questionService = require(`${appRoot}/services/Question`);
const mailer = require('../helper/mail');


const createQuestion = async (req, res) => {
    try {
        const data = await questionService.insertQuestions(req.body);
        return utilServices.successResponse(res, constants.CREATE_QUESTIONS, 200, data);
    } catch (error) {
        return utilServices.errorResponse(res, constants.DB_ERROR, 500);
    }
}

const getQuestion = async (req, res) => {
    try {
        console.log('=========req.body===in getQuestion=======', req.body)
        // console.log('=========req.body in question controller==========', req.body.website)
        if (req.body.name && req.body.email && req.body.mobilenumber && req.body.location && req.body.subject && req.body.website && req.body.age) {
            console.log('=========notification=======' )
            await mailer.sendMailFromChatBot(req.body)
            questionService.createNotification(req.body)
        }

        const detail = {};
        const dataArray = [];
        let questionId = req.body.question;
        const data = await Ouestions.findOne({ question_num: questionId });
        dataArray.push(data);
        if (data.no_answer == 1) {
            questionId = parseInt(questionId) + 1;
            const data1 = await Ouestions.findOne({ question_num: questionId });
            dataArray.push(data1);
        }
        detail.data = dataArray;
        if (data.optionTable == "location" || detail.data.length == 2) {
            const locationdata = await Location.find({}, { location: 1, _id: 0 });
            locationdata.forEach((loc) => {
                const ldata = {};
                ldata.text = loc.location
                ldata.value = loc.location
                if (detail.data.length == 2 && detail.data[1].optionTable == "location") {
                    detail.data[1].options.push(ldata);
                } else if (data.optionTable == "location") {
                    detail.data[0].options.push(ldata);
                }
            })
        }
        if (data.optionTable == "subject" || detail.data.length == 2) {
            const subjectdata = await Subject.find({}, { subject: 1, _id: 0 });
            subjectdata.forEach((sub) => {
                const subData = {};
                subData.text = sub.subject
                subData.value = sub.subject
                if (detail.data.length == 2 && detail.data[1].optionTable == "subject") {
                    detail.data[1].options.push(subData);
                } else if (data.optionTable == "subject") {
                    detail.data[0].options.push(subData);
                }
            })
        }
        return utilServices.successResponse(res, "Set values for notification.", 200, detail);
    } catch (error) {
        console.log('-----------------Notification Error===', error);
        return utilServices.errorResponse(res, "Something went wrong", 400);
    }
}



module.exports = {
    createQuestion: createQuestion,
    getQuestion: getQuestion
}