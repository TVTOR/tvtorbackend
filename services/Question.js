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
    console.log('🔄 Creating notification for query:', JSON.stringify(query, null, 2));
    
    const subtmId = await getTutorId(query.subject);
    console.log('📚 Found tutor manager IDs:', subtmId.length);
    
    const lIds = await getLocationIds(query.location);  
    console.log('📍 Found location IDs:', lIds.length);
    
    const tmIDs = await User.find({ location: { $in: lIds }, _id: { $in: subtmId }, isDeleted: false, userType: 'tutormanager', status: true });
    console.log('👥 Found matching tutor managers:', tmIDs.length);
    
    const subjectArray = (query.subject).split(',');
    const locationArray = (query.location).split(',');
    
    // Create notification even without device token for testing
    if (tmIDs.length > 0) {
      console.log('✅ Creating notification for first available manager...');
      const title = 'Notification';
      const message = `Name: ${query.name}, Year: ${query.age}, Subject: ${subjectArray} Location: ${locationArray}`;
      
      var notdata = await NotificationModel.create({
        tmId: tmIDs[0]._id,
        subject: subjectArray,
        location: locationArray,
        message: message,
        queryData: query,
      });
      
      console.log('📝 Notification created with ID:', notdata._id);
      
      // Try to send push notification if device token exists
      var devicedata = await Device.findOne({ tmId: (tmIDs[0]._id) });
      if (devicedata && devicedata.deviceToken) {
        console.log('📱 Sending push notification...');
        NotificationService.sendNotification(devicedata.deviceToken, title, message, notdata);
      } else {
        console.log('⚠️  No device token found - notification created but no push sent');
        console.log('   Manager ID:', tmIDs[0]._id);
        console.log('   For mobile team: Need to register FCM device tokens');
      }
    } else {
      console.log('❌ No matching tutor managers found!');
      console.log('   Available subjects/locations might not match');
    }
  } catch (error) {
    console.log('❌ Error creating notification:', error);
  }
}
const updateNotification = async (mobilenumber, notificationId) => {
  try {
    let queryData = {
      mobilenumber: mobilenumber
    }
    const user =  await NotificationModel.update({ _id: notificationId }, {$set:{'queryData.mobilenumber':mobilenumber}});
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
    const user =  await NotificationModel.update({ _id: notificationId }, {$set:{'queryData.tutorId':tutorId}});
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