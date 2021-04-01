'use strict';

const questionModel = require(`${appRoot}/models/Question`);
const Device = require(`${appRoot}/models/Device`);
const NotificationService = require(`${appRoot}/services/SendNotification`);
const User = require(`${appRoot}/models/User`);
const NotificationModel = require('../models/Notification');
const subjectModel = require(`${appRoot}/models/Subjects`);
const locationModel = require(`${appRoot}/models/Locations`);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectID = require('mongodb').ObjectID;

async function insertQuestions(params) {
  var obj = {
    question: params.question ? params.question : '',
    no_answer: params.no_answer ? params.no_answer : 0,
    options: params.options ? params.options : '',
    type: params.type ? params.type : '',
    title: params.title ? params.title : '',
    question_num: params.question_num ? params.question_num : '',
    optionTable: params.optionTable ? params.optionTable : '',
    languageCode: params.languageCode ? params.languageCode : '',
  };
  return await questionModel.create(obj);
}

const createNotification = async (query) => {
  try {
    const subtmId = await getTutorId(query.subject);
    const lIds = await getLocationIds(query.location);
    const tmIDs = await User.find({ location: { $in: lIds }, _id: { $in: subtmId }, isDeleted: false, userType: 'tutormanager', status: true })
    const subjectArray = (query.subject).split(',');
    const locationArray = (query.location).split(',');
    for (let i = 0; i < tmIDs.length; i++) {
      var devicedata = await Device.findOne({ tmId: (tmIDs[i]._id) });
      // console.log('========= device data ========', devicedata)
      if (devicedata && devicedata.deviceToken) {
        const title = 'Notification'
        // console.log('========query=================', query)
        const message = `Name: ${query.name}, Year: ${query.age}, Subject: ${subjectArray} Location: ${locationArray}`
        var notdata = await NotificationModel.create({
          tmId: tmIDs[i]._id,
          subject: subjectArray,
          location: locationArray,
          message: message,
          queryData: query,
        });
        // console.log('=====notdata==========', notdata)
        NotificationService.sendNotification(devicedata.deviceToken, title, message, notdata);
      }
    }
  } catch (error) {
    console.log('Error', error);
  }

}
const updateNotification = async (mobilenumber, notificationId) => {
  try {
    let queryData = {
      mobilenumber: mobilenumber
    }
    const user =  await NotificationModel.update({ _id: notificationId }, {$set:{'queryData.mobilenumber':mobilenumber}});
    // console.log("=============usrerrrrrrrrrrrr=========", user)
    return user;
  } catch (error) {
    console.log('Error', error);
  }

}

const updateTutorNotification = async (tutorId, notificationId) => {
  try {
    let queryData = {
      tutorId: tutorId
    }
    const user =  await NotificationModel.update({ _id: new ObjectID(notificationId) }, {$set:{'queryData.tutorId':tutorId}});
    // console.log("=============usrerrrrrrrrrrrr=========", user)
    return user;
  } catch (error) {
    console.log('Error', error);
  }

}

async function getTutorId(subject) {
  const sub = subject.split(',');
  let data1 = await subjectModel.find({ subject: { $in: sub } });
  let subjectArray = [];
  await data1.map((subjectData) => {
    subjectArray.push(subjectData._id);
  });
  let userData = await User.find({ subjects: { $in: subjectArray }, isDeleted: false, userType: 'tutor' });
  let usersIds = [];
  await userData.map((users) => {
    usersIds.push(users.managerId);
  });
  return usersIds;
}

async function getLocationIds(location) {
  const loc = location.split(',');
  let data2 = await locationModel.find({ location: loc });
  let locationArray = [];
  await data2.map((locationData) => {
    locationArray.push(locationData._id);
  });
  return locationArray;
}

module.exports = {
  insertQuestions,
  createNotification,
  updateNotification,
  updateTutorNotification
}