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
    console.log('📚 Found valid manager IDs:', subtmId.length);
    
    const lIds = await getLocationIds(query.location);  
    console.log('📍 Found location IDs:', lIds.length);
    
    const subjectArray = (query.subject).split(',').map(s => s.trim());
    const locationArray = (query.location).split(',').map(l => l.trim());
    const title = 'Notification';
    const message = `Name: ${query.name}, Year: ${query.age}, Subject: ${subjectArray} Location: ${locationArray}`;
    
    let notificationCreated = false;
    
    // Try to find managers and create notifications
    if (subtmId.length > 0) {
      const tmIDs = await User.find({ location: { $in: lIds }, _id: { $in: subtmId }, isDeleted: false, userType: 'tutormanager', status: true });
      console.log('👥 Found matching tutor managers:', tmIDs.length);
      
      for (let i = 0; i < tmIDs.length; i++) {
        console.log(`📱 Checking manager ${i + 1}: ${tmIDs[i].name || 'Unknown'}`);
        var devicedata = await Device.findOne({ tmId: (tmIDs[i]._id) });
        
        if (devicedata && devicedata.deviceToken) {
          console.log('✅ Found device token, creating notification...');
          var notdata = await NotificationModel.create({
            tmId: tmIDs[i]._id,
            subject: subjectArray,
            location: locationArray,
            message: message,
            queryData: query,
          });
          console.log('📝 Notification created with ID:', notdata._id);
          NotificationService.sendNotification(devicedata.deviceToken, title, message, notdata);
          notificationCreated = true;
          // break; // Exit after first successful notification
        } else {
          console.log('⚠️ No device token found for this manager');
        }
      }
    }
    
    // FALLBACK: Create notification without manager if none worked
    if (!notificationCreated) {
      console.log('🔄 No managers with device tokens found, creating fallback notification...');
      var fallbackNotdata = await NotificationModel.create({
        tmId: new mongoose.Types.ObjectId(), // Generate dummy ObjectId
        subject: subjectArray,
        location: locationArray,
        message: message,
        queryData: query,
      });
      console.log('✅ Fallback notification created with ID:', fallbackNotdata._id);
      console.log('📋 This will enable SMS sending without FCM push notifications');
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
  const sub = subject.split(',').map(s => s.trim());
  let data1 = await subjectModel.find({ subject: { $in: sub } });
  let subjectArray = [];
  await data1.map((subjectData) => {
    subjectArray.push(subjectData._id);
  });
  let userData = await User.find({ subjects: { $in: subjectArray }, isDeleted: false, userType: 'tutor' });
  let usersIds = [];
  await userData.map((users) => {
    // Only add valid ObjectIds (24 hex characters)
    if (users.managerId && mongoose.Types.ObjectId.isValid(users.managerId)) {
      usersIds.push(users.managerId);
    } else {
      console.log('⚠️ Skipping invalid managerId:', users.managerId, 'for user:', users.name || users._id);
    }
  });
  return usersIds;
}

async function getLocationIds(location) {
  const loc = location.split(',').map(l => l.trim());
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