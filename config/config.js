
require('dotenv').config()
const path = require('path');

var developmentConfig = require("./development_config");
var stagingConfig = require("./staging_config");
var productionConfig = require("./production_config");
let env = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
let config;

global.appRoot = path.normalize(`${path.resolve(__dirname)}/..`);

let envObject = {
	"development": developmentConfig,
	"staging": stagingConfig,
	"production": productionConfig
}

config = envObject[env];
console.log(config);
module.exports = {
    mongoUri: config.MONGODB_URI,
	jwtSecret: config.JWT_SECRET,
	API_URL: config.API_URL,
	EMAIL: config.EMAIL,
	PASSWORD: config.PASSWORD,
    secret: process.env.NODE_ENV === 'production' ? process.env.SECRET : 'secret'
};