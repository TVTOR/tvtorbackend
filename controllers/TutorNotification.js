var TutorNotification = require('../models/TutorNotification');
var utilServices = require('../services/Util');
var TutorAssign = require('../models/TutorAssign');
var Device = require('../models/Device');
const { constants } = require(`${appRoot}/lib/constants`);
const tutorNotificationService = require('../services/Notification');
const sendNotification = require('../services/SendNotification');


const createTutorNotification = async(req, res)=>{
    try {
        const data = await tutorNotificationService.insertTutorNotification(req.body);
        return utilServices.successResponse(res, constants.CREATE_NOTIFICATION, 200, data);
    } catch (error) {
        return utilServices.errorResponse(res, constants.DB_ERROR, 500);
    }
}

const getTutorNotification = async(req, res)=>{
    try {
        var data = await tutorNotificationService.getNotifications();
        if (!data) {
          return utilServices.errorResponse(res, constants.DATA_NOT_FOUND, 400);
        }
        return utilServices.successResponse(res, constants.DATA_FOUND, 200, data);
      } catch (error) {
        return utilServices.errorResponse(res, constants.DB_ERROR, 500);
      }
}


const sendNotificationToTutor = async (req, res)=>{
    const tutorId = req.params.id
      var devicedata =  await Device.findOne({tutorId: tutorId});
      if(devicedata && devicedata.deviceToken){
      const title = 'Notification'
      const message = `Assign to tutor!`
        await TutorNotification.create({
            tutorId: tutorId,
            message: message,
        })
        sendNotification.sendNotification(devicedata.deviceToken, title, message);                 
    }
}




module.exports = {
    createTutorNotification: createTutorNotification,
    getTutorNotification: getTutorNotification,
    sendNotificationToTutor: sendNotificationToTutor
}