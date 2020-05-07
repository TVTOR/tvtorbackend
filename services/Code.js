'use strict';

const codeModel = require(`${appRoot}/models/Code`);


async function insertCode(params) {
	var obj = {
        code: Math.floor(100000 + Math.random() * 900000),
		managerId: params.managerId ? params.managerId : null,
		used: params.used
	};
	return await codeModel.create(obj);
}

module.exports = {
    insertCode
}