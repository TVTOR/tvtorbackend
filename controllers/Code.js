const utilServices = require(`${appRoot}/services/Util`)
const { constants } = require(`${appRoot}/lib/constants`);
const codeService = require('../services/Code')

const randomNumber = async (req, res) => {
    try {
        const data = await codeService.insertCode(req.body);
        return utilServices.successResponse(res, constants.CREATE_CODE, 201, data);
    } catch (error) {
        return utilServices.errorResponse(res, constants.DB_ERROR, 500);
    }
}

const deviceData = async (req, res) => {
    try {
    var deviceId = req.body.deviceId;
    var deviceToken = req.body.deviceToken;
    console.log('[FCMDevices] deviceId:', deviceId, 'deviceToken:', deviceToken, 'req.bosy = ', req.body);
        const deviceData = await codeService.checkDeviceId(deviceId)
        let deviceDetails = {}
        if (deviceData) {
            if (req.body.deviceType) {
                deviceDetails.deviceType = req.body.deviceType;
            }
            if (deviceToken) {
                deviceDetails.deviceToken = deviceToken;
            }
            if (req.body.tmId) {
                deviceDetails.tmId = req.body.tmId;
            }
            await codeService.deviceTokenUpdate(deviceId, deviceDetails)
            const updatedDeviceData = await codeService.checkDeviceId(deviceId)
            console.log('[FCMDevices] Updated device:', updatedDeviceData);
            return utilServices.successResponse(res, constants.UPDATE_DATA, 200, updatedDeviceData);
        } else {
            const data = await codeService.insertDevice(req.body);
            console.log('[FCMDevices] Inserted device:', data);
            return utilServices.successResponse(res, constants.CREATE_DEVICES, 201, data);
        }
    } catch (error) {
        console.log('[FCMDevices] Error:', error);
        return utilServices.errorResponse(res, constants.DB_ERROR, 500);
    }
}

module.exports = {
    randomNumber: randomNumber,
    deviceData: deviceData
}