const TutorAssign = require(`${appRoot}/models/TutorAssign`)
const Notification = require(`${appRoot}/models/Notification`);
const User = require(`${appRoot}/models/User`);
const NotificationService = require(`${appRoot}/services/SendNotification`);
const utilServices = require(`${appRoot}/services/Util`);
const TutorAssignServices = require(`${appRoot}/services/TutorAssign`);
const { constants } = require(`${appRoot}/lib/constants`);
const Subject = require(`${appRoot}/models/Subjects`);
let mongoose = require('mongoose');


const assignTutor = async (req, res) => {
    try {
        const notificationId = req.body.notificationId
        const notification = await Notification.findOne({ _id: notificationId });
        // console.log('=======notification data========', notification)
        const obj = {};
        obj.name = notification.queryData.name;
        obj.email = notification.queryData.email;
        obj.subject = notification.queryData.subject;
        obj.location = notification.queryData.location;
        obj.tutorId = req.body.tutorId;
        obj.notificationId = notification._id;
        const data = await TutorAssignServices.getAssignTutorStatus(req.body.notificationId);
        console.log('===========Data============', data);
        // const emailCheck = data;
        
        console.log('===========Data============', data);
        if (data && data.length) {
            return utilServices.errorResponse(res, "Request has been expired.", 500);
        }
        await TutorAssign.create(obj, async (err, data) => {
            if (err) {
                return utilServices.errorResponse(res, "Something went wrong.", 500);
            } else {

                const title = 'Notification'
                const query = notification.queryData
                const studentmobile = notification.queryData.mobilenumber

                const subjectdata = await Subject.find({ subject: { $in: notification.subject } });
                let subjectIds = [];
                for (let i = 0; i < subjectdata.length; i++) {
                    subjectIds.push(subjectdata[i]._id);
                }
                // let subjectIds = notification.queryData.subject
                let data1 = await getAllSubject(subjectIds);
                var arrOfSubject = [];
                for (var value of data1) {
                    arrOfSubject.push(value.subject);
                }

                const message = `Contact: ${query.name} 👨🎓 for teaching ${arrOfSubject} 👨🏫 within 12h⏰ ${studentmobile}`;
                const tutordata = await User.findOne({ _id: req.body.tutorId });
                const mobileNumber = tutordata.mobileNumber ? tutordata.mobileNumber : '12345'
                const studentMobileNumber = notification.queryData.mobilenumber;
                console.log('=======tutordata=======', tutordata);
                const tutorName = tutordata.name;
                const tutorSurName = tutordata.surname;
                if (studentMobileNumber && notification.queryData) {
                    const message = `Contact: ${tutorName} ${tutorSurName} for study ${arrOfSubject} and his contact number is ${mobileNumber}`;
                    NotificationService.sendSMS(studentMobileNumber, title, message);
                }
                NotificationService.sendSMS(mobileNumber, title, message);

                return utilServices.successResponse(res, "Assign Tutor Successfully", 200, data);
            }
        })
    } catch (error) {
        console.log('-----------------', error)
        return utilServices.errorResponse(res, "Something went wrong.", 500);
    }
}

async function getAllSubject(subject) {
    let subjectData = await TutorAssignServices.getSubjectData(subject);
    return subjectData = await subjectData.map((subjectData) => {
        return { _id: subjectData._id, subject: subjectData.subject }
    });
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

const getAssignTutor = async (req, res) => {
    try {
        let tutorassigndata = await TutorAssignServices.getAssignTutor(req.body);
        console.log('=============', tutorassigndata);
        if (!tutorassigndata) {
            return utilServices.errorResponse(res, constants.DATA_NOT_FOUND, 400);
        }
        let tutorassigndataId = tutorassigndata.tutorId;
        let tutordata = await TutorAssignServices.getTutorData(tutorassigndataId);
        var data = JSON.parse(JSON.stringify(tutorassigndata));
        data.tutor = {
            name: tutordata.name ? tutordata.name : '',
            surname: tutordata.surname ? tutordata.surname : '',
            email: tutordata.email ? tutordata.email : '',
            mobileNumber: tutordata.mobileNumber ? tutordata.mobileNumber : ''
        }
        // data.tutor = tutordata
        return utilServices.successResponse(res, constants.DATA_FOUND, 200, data);

    } catch (error) {
        return utilServices.successResponse(res, constants.DB_ERROR, 500);
    }
}

module.exports = {
    assignTutor: assignTutor,
    getStudentTutor: getStudentTutor,
    getAssignTutor: getAssignTutor
}