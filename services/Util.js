var util = {};

util.successResponse = function (res, successMsg, statusCode, data = null) {
    var sendData = {
        success: true,
        data: null,
        message: null,
        statusCode: statusCode
    }
    if (data) {
        sendData.data = data;
    }
    if (successMsg) {
        sendData.message = successMsg;
    }
    if (statusCode) {
        res.status = statusCode;
    }
    return res.json(sendData);
};

util.errorResponse = function (res, errorMsg, statusCode, data = null) {
    var sendData = {
        success: false,
        data: null,
        message: null,
        statusCode: statusCode
    }
    if (errorMsg) {
        sendData.message = errorMsg
    }
    if (data) {
        sendData.data = data
    }
    if (statusCode) {
        res.status = statusCode
    }
    return res.json(sendData);
}

module.exports = util;