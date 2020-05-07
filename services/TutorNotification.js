'use strict';

const tutorNotificationModel = require(`${appRoot}/models/TutorNotification`);

async function insertTutorNotification(params) {
	var obj = {
        tutorId: params.tutorId ? params.tutorId : null,
        message: params.message ? params.message : '',
        queryData: params.queryData
	};
	return await tutorNotificationModel.create(obj);
}

async function getNotifications(){
    const notification = notificationModel.find();
    return notification;
}

module.exports = {
    insertTutorNotification,
    getNotifications
}