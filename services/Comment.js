'use strict';

const commentModel = require(`${appRoot}/models/Comment`);
const userModel = require(`${appRoot}/models/User`);


async function insertComment(params) {
	var obj = {
        comment: params.comment ? params.comment : null,
        tutorId: params.tutorId ? params.tutorId : null,
        managerId: params.managerId ? params.managerId: null
	};
	return await commentModel.create(obj);
}

async function getComments(){
    let commentdata = await commentModel.find({});
    return commentdata;
}

async function getTutorId(tutorId){
    let tutordata = await userModel.findOne({_id: tutorId, userType: 'tutor'});
    return tutordata;
}
async function getManagerId(managerId){
    let managerdata = await userModel.findOne({_id: managerId, userType: 'tutormanager'});
    return managerdata; 
}

async function getComment(tutorId, managerId){
    let commentdata = await commentModel.findOne({tutorId: tutorId, managerId: managerId});
    return commentdata;
}


async function getCommentById(commentId){
    let commentdata = await commentModel.findOne({_id: commentId});
    return commentdata;
}

async function getCommentId(updatedata){
    return await updatedata.save();
}

module.exports = {
    insertComment,
    getComments,
    getTutorId,
    getManagerId,
    getComment,
    getCommentId,
    getCommentById
}