'use strict';

const questionModel = require(`${appRoot}/models/Question`);
const Device = require(`${appRoot}/models/Device`);
const NotificationService = require(`${appRoot}/services/SendNotification`);
const User = require(`${appRoot}/models/User`);
const NotificationModel = require('../models/Notification');

async function insertQuestions(params) {
  var obj = {
    question: params.question ? params.question : '',
    no_answer: params.no_answer ? params.no_answer : 0,
    options: params.options ? params.options : '',
    type: params.type ? params.type : '',
    title: params.title ? params.title : '',
    question_num: params.question_num ? params.question_num : '',
    optionTable: params.optionTable ? params.optionTable : ''
  };
  return await questionModel.create(obj);
}

const createNotification = async (query) => {
  const tmIDs = await User.find({ location: { $in: query.location }, isDeleted: false, userType: 'tutormanager', status: true })
  console.log('=======tmIDs========', tmIDs)
  for (let i = 0; i < tmIDs.length; i++) {
    var devicedata = await Device.findOne({ tmId: (tmIDs[i]._id) });
    console.log('=======devicedata====', devicedata);
    if (devicedata && devicedata.deviceToken) {
      const title = 'Notification'
      const message = `Name: ${query.name} Email: ${query.email} Subject: ${query.subject} Location: ${query.location}`
      await NotificationModel.create({
        tmId: tmIDs[i]._id,
        subject: query.subject,
        location: query.location,
        message: message,
        queryData: query
      });
      NotificationService.sendNotification(devicedata.deviceToken, title, message);
    }
  }
}



module.exports = {
  insertQuestions,
  createNotification
}