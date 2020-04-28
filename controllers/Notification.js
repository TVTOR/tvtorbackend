var Notification = require('../models/Notification');
var utilServices = require('../services/Util');

const createNotification = async function(req, res){
    try {
        var obj = {};
        obj.managerId = req.body.managerId
        obj.subject = req.body.subject;
        obj.location = req.body.location 
        await Notification.create(obj, (err, data)=>{
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

const getNotification = async function(req, res){
    try {
        const managerId = req.params.id;
        await Notification.find({managerId: managerId}, (err, data)=>{
            if(err){
                return utilServices.errorResponse(res, "Something went wrong.", 500);
            } else {
                if(!data){
                    return utilServices.errorResponse(res, "Data not found.", 500); 
                } else {
                    return utilServices.successResponse(res, "Data found.", 200, data); 
                }
            }
        })   
    } catch (error) {
        return utilServices.errorResponse(res, "Something went wrong.", 500);
    }
}

module.exports = {
    createNotification: createNotification,
    getNotification: getNotification
}