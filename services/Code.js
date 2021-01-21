'use strict';

const codeModel = require(`${appRoot}/models/Code`);
const deviceModel = require(`${appRoot}/models/Device`);

async function insertCode(params) {
	var obj = {
		code: Math.floor(100000 + Math.random() * 900000),
		managerId: params.managerId ? params.managerId : null,
		used: params.used
	};
	return await codeModel.create(obj);
}


async function insertDevice(params) {
	const data = {
		deviceId: params.deviceId ? params.deviceId : '214525563263',
		deviceType: params.deviceType ? params.deviceType : 'android',
		deviceToken: params.deviceToken ? params.deviceToken : 'dgcgschdscjdkskj',
		tmId: params.tmId ? params.tmId : null
	}
	return await deviceModel.create(data);
}

async function checkDeviceId(deviceId) {
	const device = await deviceModel.findOne({ deviceId: deviceId });
	return device;
}

async function deviceTokenUpdate(updatedata) {
	return await updatedata.save();
}

module.exports = {
	insertCode,
	insertDevice,
	checkDeviceId,
	deviceTokenUpdate
}