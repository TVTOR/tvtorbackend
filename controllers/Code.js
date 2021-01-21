const utilServices = require(`${appRoot}/services/Util`)
const { constants } = require(`${appRoot}/lib/constants`);
const codeService = require(`${appRoot}/services/Code`);

const randomNumber = async (req, res) => {
    try {
        const data = await codeService.insertCode(req.body);
        return utilServices.successResponse(res, constants.CREATE_CODE, 200, data);
    } catch (error) {
        return utilServices.errorResponse(res, constants.DB_ERROR, 500);
    }
}

const deviceData = async (req, res) => {
    try {
        var deviceId = req.body.id;
        const deviceData = await codeService.checkDeviceId(deviceId)
        if(deviceData){
            if (req.body.deviceType) {
                deviceData.deviceType = req.body.deviceType;
            }
            if (req.body.deviceToken) {
                deviceData.deviceToken = req.body.deviceToken;
            }
          let updatedData = await codeService.deviceTokenUpdate(deviceData)
          console.log('========update device token ===========', updatedData)
            return utilServices.successResponse(res, constants.UPDATE_DATA, 200, updatedData);
        } else {
            const data = await codeService.insertDevice(req.body);
            console.log('========first time create device token===========', data)
            return utilServices.successResponse(res, constants.CREATE_DEVICES, 200, data);
        }
    } catch (error) {
        return utilServices.errorResponse(res, constants.DB_ERROR, 500);
    }
}

module.exports = {
    randomNumber: randomNumber,
    deviceData: deviceData
}