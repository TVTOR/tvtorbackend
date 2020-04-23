var Code = require('../models/Code')
var utilServices = require('../services/Util');


const randomNumber = async(req, res)=>{
   try {
       var obj = {};
       obj.code = Math.floor(100000 + Math.random() * 900000);
       obj.used = req.body.used
       obj.managerId = req.body.managerId
       Code.create(obj, (err, data) => {
        if (err) {
            return utilServices.errorResponse(res, "Somthing went wrong", 500);
        } else {
            return utilServices.successResponse(res, "Randomcode generated successfully", 200, data);
        }
    })
   } catch (error) {
    return utilServices.errorResponse(res, "Something went wrong", 401); 
   }
}

module.exports = {
    randomNumber: randomNumber
}