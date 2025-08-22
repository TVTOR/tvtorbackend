var Questions = require(`${appRoot}/models/Question`);
var utilServices = require(`${appRoot}/services/Util`);
var Location = require(`${appRoot}/models/Locations`);
var Subject = require(`${appRoot}/models/Subjects`);
const { constants } = require(`${appRoot}/lib/constants`);
const questionService = require(`${appRoot}/services/Question`);
const notificationService = require('../services/Notification');
const NotificationService = require(`${appRoot}/services/SendNotification`);
const TutorAssignServices = require(`${appRoot}/services/TutorAssign`);
const mailer = require('../helper/mail');


const createQuestion = async (req, res) => {
    try {
        const data = await questionService.insertQuestions(req.body);
        return utilServices.successResponse(res, constants.CREATE_QUESTIONS, 201, data);
    } catch (error) {
        return utilServices.errorResponse(res, constants.DB_ERROR, 500);
    }
}

const getQuestion = async (req, res) => {
    try {
        const languageCode = req.body.language ? req.body.language : 'en'
        if (req.body.name && req.body.location && req.body.subject && !req.body.website && req.body.age && req.body.notificationId == "") {
            //await mailer.sendMailFromChatBot(req.body)
            questionService.createNotification(req.body)
        }
        if (req.body.notificationId != "") {
            await questionService.updateNotification(req.body.mobilenumber, req.body.notificationId)
            let notificationDetails = await notificationService.getNotificationDetails(req.body.notificationId)
            
            if (!notificationDetails) {
                return utilServices.errorResponse(res, `Notification ${req.body.notificationId} not found`, 404);
            }
            
            let query = notificationDetails.queryData;
            if (!query) {
                return utilServices.errorResponse(res, "Notification has no query data", 400);
            }
            
            console.log('✅ Notification ID present, proceeding with SMS logic');
            console.log('🔍 Query Data:', query.tutorId[0], '----------------------------');
            const tutordata = await TutorAssignServices.getTutor(query.tutorId);
            console.log('👨‍🏫 Fetched Tutor Data:', tutordata, '------------------');
            const mobileNumber = tutordata.mobileNumber ? tutordata.mobileNumber : ''
            console.log('📞 Tutor Mobile Number:', mobileNumber, '------------------');
            let arrOfSubject = query.subject;
            let studentmobile = query.mobilenumber;
            const title = 'Notification';

            if (mobileNumber && req.body.mobilenumber) {
                const message = `Contact: ${query.name} 👨🎓 for teaching ${arrOfSubject} 👨🏫 within 12h⏰ mobile number is ${studentmobile}.`;
                try {
                    console.log('📤 Sending SMS to tutor...');
                    await NotificationService.sendSMS(mobileNumber, title, message);
                    console.log('✅ SMS to tutor sent successfully');
                } catch (error) {
                    console.error('❌ Failed to send SMS to tutor:', error.message);
                }
            }
            if (studentmobile && query) {
                const message = `Your ${arrOfSubject} Tutor ${tutordata.name} ${tutordata.surname} will contact you in the next 12h. You can Contact him/her before that time at ${mobileNumber}.`;
                try {
                    console.log('📤 Sending SMS to student...');
                    await NotificationService.sendSMS(studentmobile, title, message);
                    console.log('✅ SMS to student sent successfully');
                } catch (error) {
                    console.error('❌ Failed to send SMS to student:', error.message);
                }
            }
        }

        const detail = {};
        const dataArray = [];
        let questionId = parseInt(req.body.question);
        const data = await Questions.findOne({ question_num: questionId, languageCode: languageCode });
        
        // Check if question exists
        if (!data) {
            return utilServices.errorResponse(res, `Question ${questionId} not found for language ${languageCode}`, 404);
        }
        
        dataArray.push(data);
        if (data.no_answer == 1) {
            questionId = parseInt(questionId) + 1;
            const data1 = await Questions.findOne({ question_num: questionId, languageCode: languageCode });
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
        console.error('Questions API Error:', error);
        return utilServices.errorResponse(res, `Questions API Error: ${error.message}`, 400);
    }
}



module.exports = {
    createQuestion: createQuestion,
    getQuestion: getQuestion
}