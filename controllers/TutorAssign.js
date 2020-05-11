var TutorAssign = require('../models/TutorAssign');
var Notification = require('../models/Notification');
var utilServices = require('../services/Util');
const User = require('../models/User');
const NotificationService = require('../services/SendNotification');
var utilServices = require('../services/Util');
const TutorAssignServices = require(`${appRoot}/services/TutorAssign`);
const { constants } = require(`${appRoot}/lib/constants`);

const assignTutor = async (req, res) => {
    try {
        const notificationId = req.body.notificationId
        const notification = await Notification.findOne({ _id: notificationId });
        const obj = {};
        obj.name = notification.queryData.name;
        obj.email = notification.queryData.email;
        obj.subject = notification.queryData.subject;
        obj.location = notification.queryData.location;
        obj.tutorId = req.body.tutorId
        obj.notificationId = notification._id;
        await TutorAssign.create(obj, async (err, data) => {
            if (err) {
                return utilServices.errorResponse(res, "Something went wrong.", 500);
            } else {
                const title = 'Notification'
                const query = notification.queryData
                const message = `Name: ${query.name}
                                 Email: ${query.email}
                                 Subject: ${query.subject}
                                 Location: ${query.location}`
                const tutordata = await User.findOne({ _id: req.body.tutorId });
                const mobileNumber = tutordata.mobileNumber ? tutordata.mobileNumber : '12345'
                NotificationService.sendSMS(mobileNumber, title, message)
                return utilServices.successResponse(res, "Created successfully.", 200, data);
            }
        })
    } catch (error) {
        return utilServices.errorResponse(res, "Something went wrong.", 500);
    }
}



const getStudentTutor = async (req, res) => {
    try {
        const emailId = req.params.email;
        let tutorassigndata = await TutorAssignServices.getStudentTutorByEmail(emailId)
        if (!tutorassigndata) {
            return utilServices.errorResponse(res, constants.DATA_NOT_FOUND, 400);
        }
        let tutorassigndataId = tutorassigndata.tutorId;
        let tutordata = await TutorAssignServices.getTutorData(tutorassigndataId);
        var data = JSON.parse(JSON.stringify(tutorassigndata));
        data.tutor = {
            name: tutordata.name ? tutordata.name : '',
            surname: tutordata.surname ? tutordata.surname : ''
        }
        return utilServices.successResponse(res, constants.DATA_FOUND, 200, data);
    } catch (error) {
        return utilServices.successResponse(res, constants.DB_ERROR, 500);
    }
}

module.exports = {
    assignTutor: assignTutor,
    getStudentTutor: getStudentTutor
}