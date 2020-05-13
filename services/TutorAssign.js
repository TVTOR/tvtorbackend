'use strict';

const assignTutorModel = require(`${appRoot}/models/TutorAssign`);
const userModel = require(`${appRoot}/models/User`);
const subjectModel = require(`${appRoot}/models/Subjects`);
let mongoose = require('mongoose');

async function getStudentTutorByEmail(emailId){
    let assigndata = await assignTutorModel.findOne({email: emailId});
    return assigndata;
}

async function getTutorData(tutorId){
    var tutordata = await userModel.findOne({ _id: tutorId });
    return tutordata;
}
async function getSubjectData(subject) {
	var splitSubject = subject[0].split(',').map((elem) => mongoose.Types.ObjectId(elem))
	return await subjectModel.find({ _id: { $in: splitSubject } });
}

module.exports = {
    getStudentTutorByEmail,
    getTutorData,
    getSubjectData
}