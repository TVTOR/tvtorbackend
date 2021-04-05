'use strict';

const usersModel = require(`${appRoot}/models/User`);
const codeModel = require(`${appRoot}/models/Code`);
const subjectModel = require(`${appRoot}/models/Subjects`);
var userSessionModel = require(`${appRoot}/models/Session`);
const locationModel = require(`${appRoot}/models/Locations`);
const deviceModel = require(`${appRoot}/models/Device`);
const userSesseion = require(`${appRoot}/models/Session`);
const commentModel = require(`${appRoot}/models/Comment`);

var mongoose = require('mongoose');

async function validEmail(email) {
	return await usersModel.findOne({
		email: email
	});
}

async function validCode(code) {
	return await codeModel.findOne({
		code: code
	});
}

async function validMobileNumber(mobileNumber) {
	return await usersModel.findOne({
		mobileNumber: mobileNumber
	});
}

async function insertUser(params, password, managerId = '') {
	var obj = {
		name: params.name ? params.name : '',
		surname: params.surname ? params.surname : '',
		email: params.email,
		password: password,
		location: params.location,
		subjects: params.subjects,
		status: params.status ? params.status : false,
		isDeleted: params.isDeleted ? params.isDeleted : false,
		managerId: managerId ? managerId : null,
		mobileNumber: params.mobileNumber ? params.mobileNumber : '',
		code: params.code ? params.code : '',
		userType: params.userType ? params.userType : ''
	};
	return await usersModel.create(obj);
}

async function updateCode(code) {
	return await codeModel.updateOne({ code: code }, { used: true });
}

async function getLocationData(location) {
	const splitLocation = location.map((elem) => mongoose.Types.ObjectId(elem))
	return await locationModel.find({ _id: { $in: splitLocation } });
}

async function getSubjectData(subject) {
	if (subject && subject.length) {
		var splitSubject = subject.map((elem) => mongoose.Types.ObjectId(elem))
	} else {
		var splitSubject = [];
	}
	return await subjectModel.find({ _id: { $in: splitSubject } });
}

async function insertSession(id, userType, token) {
	var userData = {
		userId: id,
		userType: userType,
		token: token,
	}
	return await userSessionModel.create(userData);
}

async function getUsersList() {
	const data = await usersModel.find({});
	return data;
}

async function removeSession(userId) {
	const userSesseionData = await userSesseion.remove({ userId: userId });
	return userSesseionData;
}

async function getSingleUser(userId) {
	const user = await usersModel.findById({ _id: userId });
	return user;
}

async function userDelete(userId) {
	const user = await usersModel.findByIdAndDelete({ _id: userId });
	return user;
}

async function deleteTM(userId) {
	const user = await usersModel.findByIdAndDelete({ _id: userId });
	return user;
}

async function deleteTMandTutors(userId) {
	let id = mongoose.Types.ObjectId(userId);
	const user = await usersModel.deleteMany({ managerId: id });
	return user;
}

async function getTutorManagersList(search, sort, order, perpage, skip) {
	const user = await usersModel.find(search)
		.collation({ 'locale': 'en' })
		.sort({ [sort]: parseInt(order) })
		.skip(skip)
		.limit(perpage);
	return user;
}

async function countTutorManager(search) {
	const total = await usersModel.count(search);
	return total;
}

async function getAllTutorManagers(search, sort, order, perpage, skip) {
	const user = await usersModel.find(search)
		.collation({ 'locale': 'en' })
		.sort({ [sort]: parseInt(order) })
		.skip(skip)
		.limit(perpage);
	return user;
}

async function acceptTutorManagers(userId, statuschange) {
	const user = await usersModel.updateOne({ _id: userId }, { status: statuschange });
	return user;
}

async function declineTutorManagers(userId, statuschange) {
	const user = await usersModel.updateOne({ _id: userId }, { isDeleted: statuschange });
	return user;
}

async function statusForLogin(email, loginStatus) {
	const user = await usersModel.updateOne({ email: email }, { loginStatus: loginStatus });
	return user;
}


async function statusForLogout(userId, loginStatus) {
	let id = mongoose.Types.ObjectId(userId);
	const user = await usersModel.updateOne({ _id: id }, { loginStatus: loginStatus });
	return user;
}

async function getAllTutorsOfManagersList(search, sort, order, perpage, skip) {
	const user = await usersModel.find(search)
		.collation({ 'locale': 'en' })
		.sort({ [sort]: parseInt(order) })
		.skip(skip)
		.limit(perpage);
	return user;
}

async function checkUser(userId) {
	const user = await usersModel.findById(userId);
	return user;
}

async function userUpdate(updatedata) {
	return await updatedata.save();
}

async function getComment(tutorId) {
	let comment = await commentModel.findOne({ tutorId: tutorId });
	return comment;
}

async function getToken(token) {
	const userSesseionData = await userSesseion.findOne({ token: token });
	return userSesseionData;
}

async function deleteTutorManagerDeviceRecord(tutorManagerId) {
	const user = await deviceModel.findOneAndDelete({ tmId: tutorManagerId });
	return user;
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
	getUsersList,
	removeSession,
	getSingleUser,
	userDelete,
	getTutorManagersList,
	countTutorManager,
	getAllTutorManagers,
	acceptTutorManagers,
	declineTutorManagers,
	getAllTutorsOfManagersList,
	checkUser,
	userUpdate,
	getComment,
	getToken,
	statusForLogin,
	statusForLogout,
	deleteTM,
	deleteTMandTutors,
	deleteTutorManagerDeviceRecord
}