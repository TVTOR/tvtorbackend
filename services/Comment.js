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
module.exports = {
    insertComment,
    getComments,
    getTutorId,
    getManagerId
}