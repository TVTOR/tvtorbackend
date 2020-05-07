var Notification = require('../models/Notification');
var utilServices = require('../services/Util');
const { constants } = require(`${appRoot}/lib/constants`);
const notificationService = require('../services/Notification');

const createNotification = async function (req, res) {
    try {
        const data = await notificationService.insertNotification(req.body);
        return utilServices.successResponse(res, constants.CREATE_NOTIFICATION, 200, data);
    } catch (error) {
        return utilServices.successResponse(res, constants.DB_ERROR, 500);
    }
}

const getNotification = async function (req, res) {
    try {
        var managerId = req.params.id;
        var data = await notificationService.getNotifications(managerId);
        if (!data) {
          return utilServices.errorResponse(res, constants.DATA_NOT_FOUND, 400);
        }
        return utilServices.successResponse(res, constants.DATA_FOUND, 200, data);
      } catch (error) {
        return utilServices.errorResponse(res, constants.DB_ERROR, 500);
      }
}

module.exports = {
    createNotification: createNotification,
    getNotification: getNotification
}