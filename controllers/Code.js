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
        const data = await codeService.insertDevice(req.body);
        return utilServices.successResponse(res, constants.CREATE_DEVICES, 200, data);
    } catch (error) {
        return utilServices.errorResponse(res, constants.DB_ERROR, 500);
    }
}

const updateDeviceToken = async function (req, res) {
    try {
        var deviceId = req.params.id;
        const deviceData = await codeService.checkDeviceId(deviceId)
        if (!deviceData) {
            return utilServices.errorResponse(res, constants.DATA_NOT_FOUND, 404);
        }
        if (req.body.deviceType) {
            deviceData.deviceType = req.body.deviceType;
        }
        if (req.body.deviceToken) {
            deviceData.deviceToken = req.body.deviceToken;
        }
        const data1 = await codeService.deviceTokenUpdate(deviceData)
        return utilServices.successResponse(res, constants.UPDATE_DATA, 200, data1);
    } catch (error) {
        return utilServices.successResponse(res, constants.DB_ERROR, 500);
    }
}

module.exports = {
    randomNumber: randomNumber,
    deviceData: deviceData,
    updateDeviceToken: updateDeviceToken
}