const NotificationService = require(`${appRoot}/services/SendNotification`);
const utilServices = require(`${appRoot}/services/Util`);
const TutorAssignServices = require(`${appRoot}/services/TutorAssign`);
const TutorAssign = require(`${appRoot}/models/TutorAssign`);
const { constants } = require(`${appRoot}/lib/constants`);


const assignTutor = async (req, res) => {
    try {
        console.log('==============assignTutor========================')
        const notificationId = req.body.notificationId
        const notification = await TutorAssignServices.getNotificationData(notificationId);
        // console.log('=======notification data========', notification)
        const obj = {};
        obj.name = notification.queryData.name;
        obj.email = notification.queryData.email;
        obj.subject = notification.queryData.subject;
        obj.location = notification.queryData.location;
        obj.tutorId = req.body.tutorId;
        obj.notificationId = notification._id;
        const notificationemail = notification.queryData.email;
        const data = await TutorAssignServices.getAssignTutorStatus(req.body.notificationId);
        if (data && data.length) {
            return utilServices.errorResponse(res, constants.REQUEST_EXPIRED, 500);
        }
        console.log('-------Notification Time----------', notification.createdAt.valueOf())
        let curruntTime = new Date().getTime();
        let timedata = curruntTime - notification.createdAt.valueOf();
        if (timedata > 60000) {
            return utilServices.errorResponse(res, constants.TIME_SESSION, 500);
        }
        const tutorassigndata = await TutorAssignServices.tutorAssign(notificationemail);
        if (tutorassigndata && tutorassigndata.length) {
            return utilServices.errorResponse(res, constants.ALREADY_ASSIGNED_TUTOR, 500);
        }
        await TutorAssign.create(obj, async (err, data) => {
            if (err) {
                return utilServices.errorResponse(res, constants.DB_ERROR, 500);
            } else {
                const title = 'Notification'
                const query = notification.queryData
                const studentmobile = notification.queryData.mobilenumber;
                let notsubject = notification.subject
                const subjectdata = await TutorAssignServices.getSubjectfromNotification(notsubject);
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

                const message = `Contact: ${query.name} 👨🎓 for teaching ${arrOfSubject} 👨🏫 within 12h⏰ ${studentmobile} and his email id is ${query.email}.`;
                const id = req.body.tutorId
                const tutordata = await TutorAssignServices.getTutor(id);
                const mobileNumber = tutordata.mobileNumber ? tutordata.mobileNumber : '12345'
                const studentMobileNumber = notification.queryData.mobilenumber;
                console.log('=======tutordata=======', tutordata);
                const tutorName = tutordata.name;
                const tutorSurName = tutordata.surname;
                const tutorEmail = tutordata.email;
                if (studentMobileNumber && notification.queryData) {
                    const message = `Your ${arrOfSubject} Tutor ${tutorName} ${tutorSurName} will contact you in the next 12h. You can Contact him/her before that time at ${mobileNumber} or ${tutorEmail}.`;
                    // Your Math Tutor Madhur will contact you in the next 12h. You can Contact him/her before that time at T.NUMBER or EMAIL
                    NotificationService.sendSMS(studentMobileNumber, title, message);
                }
                NotificationService.sendSMS(mobileNumber, title, message);

                // $gt: new Date(ISODate().getTime() - 1000  60  1)
                return utilServices.successResponse(res, constants.ASSIGN_TUTOR, 200, data);
            }
        })
    } catch (error) {
        console.log('-----------------', error)
        return utilServices.errorResponse(res, constants.DB_ERROR, 500);
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



const checkTutorAssignOrNot = async (req, res) => {
    try {
        const emailId = req.params.email;
        console.log('================', req.params);
        // , createdAt:{$lt: Date.now()
        var now = new Date();
        now.setMinutes(now.getMinutes() - 1); // timestamp
        now = new Date(now); // Date object
        console.log(now);
        var data = await TutorAssign.findOne({ email: emailId, createdAt: { $gt: now } })
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
    getAssignTutor: getAssignTutor,
    checkTutorAssignOrNot: checkTutorAssignOrNot
}