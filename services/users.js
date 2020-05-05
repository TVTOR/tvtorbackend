'use strict';

const usersModel = require(`${appRoot}/models/User`);
const codeModel = require(`${appRoot}/models/Code`);
const subjectModel = require(`${appRoot}/models/Subjects`);
var userSessionModel = require(`${appRoot}/models/Session`);
const locationModel = require(`${appRoot}/models/Locations`);
const deviceModel = require(`${appRoot}/models/Device`);
var mongoose = require('mongoose');

async function validEmail(email){
	return await usersModel.findOne({
		email: email
	});
}

async function validCode(code){
	return await codeModel.findOne({
		code: code
	});
}

async function validMobileNumber(mobileNumber){
	return await usersModel.findOne({
		mobileNumber: mobileNumber
	});
}

async function insertUser(params, password, managerId=''){
	var obj = {
		name: params.name?params.name:'',
		surname: params.surname?params.surname:'',
		email: params.email,
		password: password,
		location: params.location,
		subjects: params.subjects,
		status: params.status?params.status:false,
		isDeleted: params.isDeleted?params.isDeleted:false,
		managerId: managerId?managerId:null,
		mobileNumber: params.mobileNumber?params.mobileNumber:'',
		code: params.code?params.code:'',
		userType: params.userType?params.userType:''
	};
	return await usersModel.create(obj);
}

async function updateCode(code){
	return await codeModel.updateOne({code: code}, {used: true});
}

async function getLocationData(location){
	const splitLocation = location.map((elem) => mongoose.Types.ObjectId(elem))
	return await  locationModel.find({ _id: { $in: splitLocation } });
}

async function getSubjectData(subject){
	var splitSubject = subject.map((elem) => mongoose.Types.ObjectId(elem))
	return await  subjectModel.find({ _id: { $in: splitSubject } });
}

async function insertSession(id, userType, token){
	var userData = {
		userId: id,
		userType: userType,
		token: token,
	}
	return await userSessionModel.create(userData);
}

async function insertDevice(params, userType, id){
	const data = {
		deviceId: params.deviceId,
		deviceType: params.deviceType,
		deviceToken: params.deviceToken,
	}
	if(userType == 'tutormanager'){
		data.tmId = id 
	} else if(userType == 'tutor'){
		data.tutorId =  id 
	}
	return await  deviceModel.create(data);
}

module.exports = {
	validEmail,
	validCode,
	validMobileNumber,
	insertUser,
	updateCode,
	getLocationData,
	getSubjectData,
	insertSession,
	insertDevice
}