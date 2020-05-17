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
	var splitSubject = subject.map((elem) => mongoose.Types.ObjectId(elem))
	return await subjectModel.find({ _id: { $in: splitSubject } });
}

async function getAssignTutor(deatils){
   let assignData = await assignTutorModel.findOne({name: deatils.name, email: deatils.email, subject: deatils.subject, location: deatils.location});
   return assignData;
}

module.exports = {
    getStudentTutorByEmail,
    getTutorData,
    getSubjectData,
    getAssignTutor
}