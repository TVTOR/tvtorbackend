var User = require('../models/User');
var config = require('../config/config');
var jwt = require('jsonwebtoken');
var utilServices = require('./Util');
var userSession = require('../models/Session');

const verifyToken = async(req, res, next)=>{
    try {
        let token = req.headers['x-access-token'] || req.headers['authorization'] || req.query.token; // Express headers are auto converted to lowercase
        if(token){
          jwt.verify(token, config.jwtSecret, (err, decoded)=>{
               if(err){
                return utilServices.errorResponse(res, "Unauthorized", 401);
               } else {
                   if(decoded){
                       userSession.findOne({'userId': decoded._id})
                       .lean()
                       .exec(function(err, result){
                           if(err){
                            return utilServices.errorResponse(res, "Unauthorized", 401); 
                           } else {
                               if(result){
                                   next();
                               }
                           }
                       })
                   } else {
                    return utilServices.errorResponse(res, "Unauthorized", 401);
                   }
               }
           })
       } else {
        return utilServices.errorResponse(res, "Unauthorized", 401);
       }
    } catch (error) {
        return utilServices.errorResponse(res, "Something went wrong", 401);
    }
}


module.exports = {
    verifyToken: verifyToken
}