var TutorNotification = require('../models/TutorNotification');
var utilServices = require('../services/Util');
var TutorAssign = require('../models/TutorAssign');
var Device = require('../models/Device');
var NotificationServise = require('../services/SendNotification');


const createTutorNotification = async(req, res)=>{
    try {
        var obj = {};
        obj.tutorId = req.body.tutorId,
        obj.message = req.body.message
        await TutorNotification.create(obj, (err, data)=>{
            if(err){
                return utilServices.errorResponse(res, "Something went wrong.", 500);
            } else {
                return utilServices.successResponse(res, "Created successfully.", 200, data);
            }
        })
    } catch (error) {
        return utilServices.errorResponse(res, "Something went wrong.", 500);
    }
}

const getTutorNotification = async(req, res)=>{
    try {
        await TutorNotification.find((err, data)=>{
            if(err){
                return utilServices.errorResponse(res, "Something went wrong.", 500);
            } else {
                if(!data){
                    return utilServices.errorResponse(res, "Data not found.", 500); 
                } else {
                    return utilServices.successResponse(res, "Data found.", 200, data); 
                }
            }
        });
    } catch (error) {
        return utilServices.errorResponse(res, "Something went wrong.", 500);
    }
}


const sendNotificationToTutor = async (req, res)=>{
    const tutorId = req.params.id
    const tutordata = await TutorAssign.findOne({tutorId: tutorId} )
    // console.log('---------------Tutor Model------------', tutordata)
      var devicedata =  await Device.findOne({tutorId: tutorId});
      console.log('=====devicedata===========', devicedata)
      if(devicedata && devicedata.deviceToken){
      const title = 'Notification'
      const message = `Assign to tutor!`
        await TutorNotification.create({
            tutorId: tutorId,
            message: message,
        })
     NotificationServise.sendNotification(devicedata.deviceToken, title, message);                 
    }
}




module.exports = {
    createTutorNotification: createTutorNotification,
    getTutorNotification: getTutorNotification,
    sendNotificationToTutor: sendNotificationToTutor
}