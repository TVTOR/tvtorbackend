'use strict';

const commentModel = require(`${appRoot}/models/Comment`);


async function insertComment(params) {
	var obj = {
		comment: params.comment ? params.comment : null,
	};
	return await commentModel.create(obj);
}

async function getComments(){
    let commentdata = await commentModel.find({});
    return commentdata;
}
module.exports = {
    insertComment,
    getComments
}