const NotificationService = require(`${appRoot}/services/SendNotification`);
const utilServices = require(`${appRoot}/services/Util`);
const TutorAssignServices = require(`${appRoot}/services/TutorAssign`);
const TutorAssign = require(`${appRoot}/models/TutorAssign`);
const questionService = require(`${appRoot}/services/Question`);
const { constants } = require(`${appRoot}/lib/constants`);


const assignTutor = async (req, res) => {
    try {
        const notificationId = req.body.notificationId;

        // Accept either the new `tutorIds` array (1..3) or the legacy `tutorId` single value.
        let tutorIds = [];
        if (Array.isArray(req.body.tutorIds)) {
            tutorIds = req.body.tutorIds.filter(id => typeof id === 'string' && id.length > 0);
        } else if (req.body.tutorId) {
            tutorIds = [req.body.tutorId];
        }
        // Deduplicate while keeping order
        tutorIds = [...new Set(tutorIds)];

        if (tutorIds.length < 1 || tutorIds.length > 3) {
            return utilServices.errorResponse(res, constants.DB_ERROR, 500);
        }

        const notification = await TutorAssignServices.getNotificationData(notificationId);
        const notificationemail = notification.queryData.email;

        // Same guards as before, executed once for the whole batch.
        const data = await TutorAssignServices.getAssignTutorStatus(notificationId);
        if (data && data.length) {
            return utilServices.errorResponse(res, constants.REQUEST_EXPIRED, 500);
        }
        let curruntTime = new Date().getTime();
        let timedata = curruntTime - notification.createdAt.valueOf();
        if (timedata > 60000) {
            return utilServices.errorResponse(res, constants.TIME_SESSION, 500);
        }
        const tutorassigndata = await TutorAssignServices.tutorAssign(notificationemail);
        if (tutorassigndata && tutorassigndata.length) {
            return utilServices.errorResponse(res, constants.ALREADY_ASSIGNED_TUTOR, 500);
        }

        // Base document shared across all created assignments.
        const baseObj = {
            name: notification.queryData.name || 'Student',
            email: notification.queryData.email,
            subject: notification.queryData.subject,
            location: notification.queryData.location,
            notificationId: notification._id,
        };

        // Create one TutorAssign per selected tutor.
        let createdDocs;
        try {
            createdDocs = await Promise.all(
                tutorIds.map(tid => TutorAssign.create({ ...baseObj, tutorId: tid }))
            );
        } catch (err) {
            return utilServices.errorResponse(res, constants.DB_ERROR, 500);
        }

        // Update TutorNotification for each tutor.
        await Promise.all(
            tutorIds.map(tid => questionService.updateTutorNotification(tid, notificationId))
        );

        // Build the subject list once.
        const notsubject = notification.subject;
        const subjectdata = await TutorAssignServices.getSubjectfromNotification(notsubject);
        const subjectIds = subjectdata.map(s => s._id);
        const data1 = await getAllSubject(subjectIds);
        const arrOfSubject = data1.map(v => v.subject);

        // Fetch tutor info in parallel to compose the SMS body.
        const tutors = await Promise.all(tutorIds.map(id => TutorAssignServices.getTutor(id)));

        const studentMobileNumber = notification.queryData.mobilenumber;
        if (studentMobileNumber && notification.queryData) {
            const tutorListText = tutors
                .map(t => `${t.name || ''} ${t.surname || ''} (${t.mobileNumber || 'n/d'})`)
                .join(', ');
            const message = tutors.length === 1
                ? `Your ${arrOfSubject} Tutor ${tutors[0].name} ${tutors[0].surname} will contact you in the next 12h. You can contact him/her before that time at ${tutors[0].mobileNumber || '12345'}.`
                : `Your ${arrOfSubject} Tutors are: ${tutorListText}. They will contact you within 12h. You can reach them at the numbers above.`;
            try {
                console.log('📤 Sending SMS to student from TutorAssign...');
                //await NotificationService.sendSMS(studentMobileNumber, 'Notification', message);
                console.log('✅ SMS to student sent successfully from TutorAssign');
            } catch (error) {
                console.error('❌ Failed to send SMS to student from TutorAssign:', error.message);
            }
        }

        return utilServices.successResponse(res, constants.ASSIGN_TUTOR, 200, createdDocs);
    } catch (error) {
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
        return utilServices.errorResponse(res, constants.DB_ERROR, 500);
    }
}



const checkTutorAssignOrNot = async (req, res) => {
    try {
        const emailId = req.params.email;
        var now = new Date();
        now.setMinutes(now.getMinutes() - 1); // timestamp
        now = new Date(now); // Date object
        console.log(now);
        var data = await TutorAssign.findOne({ email: emailId, createdAt: { $gt: now } })
        return utilServices.successResponse(res, constants.DATA_FOUND, 200, data);
    } catch (error) {
        return utilServices.errorResponse(res, constants.DB_ERROR, 500);
    }
}

const getAssignTutor = async (req, res) => {
    try {
        let tutorassigndata = await TutorAssignServices.getAssignTutor(req.body);
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
            mobileNumber: tutordata.mobileNumber ? tutordata.mobileNumber : '',
            imageUrl: tutordata.imageUrl ? tutordata.imageUrl : '',
            description: tutordata.description ? tutordata.description : 'No Descriptions',
        }
        return utilServices.successResponse(res, constants.DATA_FOUND, 200, data);

    } catch (error) {
        return utilServices.errorResponse(res, constants.DB_ERROR, 500);
    }
}

module.exports = {
    assignTutor: assignTutor,
    getStudentTutor: getStudentTutor,
    getAssignTutor: getAssignTutor,
    checkTutorAssignOrNot: checkTutorAssignOrNot
}
