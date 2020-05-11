'use strict';

const assignTutorModel = require(`${appRoot}/models/TutorAssign`);
const userModel = require(`${appRoot}/models/User`);

async function getStudentTutorByEmail(emailId){
    let assigndata = await assignTutorModel.findOne({email: emailId});
    return assigndata;
}

async function getTutorData(tutorId){
    var tutordata = await userModel.findOne({ _id: tutorId });
    return tutordata;
}

module.exports = {
    getStudentTutorByEmail,
    getTutorData
}