var TutorAssign = require('../models/TutorAssign');
var Notification = require('../models/Notification');
var utilServices = require('../services/Util');

const assignTutor = async(req, res)=>{
    try {
        const notificationId = req.body.notificationId
        const notification = await Notification.findOne({_id: notificationId});
        const obj = {};
        obj.name = notification.queryData.name;
        obj.email = notification.queryData.email;
        obj.subject = notification.queryData.subject;
        obj.location = notification.queryData.location;
        obj.tutorId = req.body.tutorId
        obj.notificationId = notification._id;
       await TutorAssign.create(obj, (err, data)=>{
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

module.exports = {
    assignTutor: assignTutor
}