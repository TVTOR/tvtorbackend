var Code = require('../models/Code')
var utilServices = require('../services/Util');
const { constants } = require(`${appRoot}/lib/constants`);
const codeService = require('../services/Code');

const randomNumber = async(req, res)=>{
    try {
        const data = await codeService.insertCode(req.body);
        return utilServices.successResponse(res, constants.CREATE_CODE, 200, data);
      } catch (error) {
        return utilServices.errorResponse(res, constants.DB_ERROR, 500);
    }
 }

 const deviceData = async (req, res)=>{
     try {
        const data = await codeService.insertDevice(req.body);
        console.log('------------------data----------------', data)
        return utilServices.successResponse(res, constants.CREATE_DEVICES, 200, data);
     } catch (error) {
        return utilServices.errorResponse(res, constants.DB_ERROR, 500); 
     }
 }

module.exports = {
    randomNumber: randomNumber,
    deviceData: deviceData
}