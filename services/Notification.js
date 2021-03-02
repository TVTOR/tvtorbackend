'use strict';

const notificationModel = require(`${appRoot}/models/Notification`);

async function insertNotification(params) {
    var obj = {
        tmId: params.tmId ? params.tmId : null,
        subject: params.subject ? params.subject : '',
        location: params.location ? params.location : '',
        message: params.message ? params.message : '',
        queryData: params.queryData
    };
    return await notificationModel.create(obj);
}

async function getNotifications(managerId) {
    const notification = notificationModel.find({ tmId: managerId });
    return notification;
}

// getNotificationDetails
async function getNotificationDetails(notificationId) {
    const notification = notificationModel.findOne({ _id: notificationId });
    return notification;
}
module.exports = {
    insertNotification,
    getNotifications,
    getNotificationDetails
}