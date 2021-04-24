'use strict';

const assignTutorModel = require(`${appRoot}/models/TutorAssign`);
const userModel = require(`${appRoot}/models/User`);
const subjectModel = require(`${appRoot}/models/Subjects`);
const notificationModel = require(`${appRoot}/models/Notification`);
const tutorAssignModel = require(`${appRoot}/models/TutorAssign`);
let mongoose = require('mongoose');

async function getStudentTutorByEmail(emailId) {
    let assigndata = await assignTutorModel.findOne({ email: emailId });
    return assigndata;
}

async function getTutorData(tutorId) {
    var tutordata = await userModel.findOne({ _id: tutorId });
    return tutordata;
}
async function getSubjectData(subject) {
    var splitSubject = subject.map((elem) => mongoose.Types.ObjectId(elem))
    return await subjectModel.find({ _id: { $in: splitSubject } });
}

async function getAssignTutor(deatils) {
    let assignData = await assignTutorModel.findOne({ name: deatils.name, email: deatils.email, subject: deatils.subject, location: deatils.location });
    return assignData;
}

async function alreadyAssigned(notificationId, statuschange) {
    const user = await assignTutorModel.updateOne({ notificationId: notificationId }, { status: true });
    return user;
}

async function getAssignTutorStatus(notificationId) {
    let assignData = await assignTutorModel.find({ notificationId: notificationId });
    return assignData;
}

async function getNotificationData(notificationId) {
    let notificationData = await notificationModel.findOne({ _id: notificationId });
    return notificationData
}

async function tutorAssign(notificationemail) {
    let tutorAssignData = await tutorAssignModel.find({ email: notificationemail });
    return tutorAssignData
}

async function getSubjectfromNotification(notsubject) {
    let subjectData = await subjectModel.find({ subject: { $in: notsubject } });
    return subjectData
}

async function getTutor(tutorId) {
    let tutorData = await userModel.findOne({ _id: tutorId });
    return tutorData
}


module.exports = {
    getStudentTutorByEmail,
    getTutorData,
    getSubjectData,
    getAssignTutor,
    alreadyAssigned,
    getAssignTutorStatus,
    getNotificationData,
    tutorAssign,
    getSubjectfromNotification,
    getTutor
}