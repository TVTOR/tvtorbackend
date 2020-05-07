'use strict';

const notificationModel = require(`${appRoot}/models/Notification`);

async function insertNotification(params) {
	var obj = {
        managerId: params.managerId ? params.managerId : null,
        subject: params.subject ? params.subject : '',
        location: params.location ? params.location : '',
        message: params.message ? params.message : '',
        queryData: params.queryData
	};
	return await notificationModel.create(obj);
}

async function getNotifications(managerId){
    const notification = notificationModel.find({managerId: managerId});
    return notification;
}

module.exports = {
    insertNotification,
    getNotifications
}