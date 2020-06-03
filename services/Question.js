'use strict';

const questionModel = require(`${appRoot}/models/Question`);
const Device = require(`${appRoot}/models/Device`);
const NotificationService = require(`${appRoot}/services/SendNotification`);
const User = require(`${appRoot}/models/User`);
const NotificationModel = require('../models/Notification');
const subjectModel = require(`${appRoot}/models/Subjects`);
const locationModel = require(`${appRoot}/models/Locations`);

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
  try {
    const subtmId = await getTutorId(query.subject);
    // console.log('=====subId==========', subtmId);
    const lIds = await getLocationIds(query.location);
    const tmIDs = await User.find({ location: { $in: lIds }, _id: { $in: subtmId }, isDeleted: false, userType: 'tutormanager', status: true })
    console.log('=========tmIDs============', tmIDs[0]._id);
    const subjectArray = (query.subject).split(',');
    const locationArray = (query.location).split(',');
    // let data1 = await subjectModel.find({ _id:  query.subject });
    // let data2 = await locationModel.find({ _id: query.location });
    // let subjectData = await getSubjectData(subject);
    // let subjectArray = [];
    // await data1.map((subjectData) => {
    //   subjectArray.push(subjectData.subject)
    // });
    // let locationArray = [];
    // await data2.map((locationData) => {
    //   locationArray.push(locationData.location)
    // });
    // // var arrOfSubject = [];
    // for (var value of data1) {
    //   subjectArray.push({subject: value.subject })
    // }
    for (let i = 0; i < tmIDs.length; i++) {
      console.log('-----{ tmId: (tmIDs[i]._id) }----------', { tmId: (tmIDs[i]._id) })
      var devicedata = await Device.findOne({ tmId: (tmIDs[i]._id) });
      if (devicedata && devicedata.deviceToken) {
        const title = 'Notification'
        const message = `Name: ${query.name} Email: ${query.email} Subject: ${subjectArray} Location: ${locationArray}`
        await NotificationModel.create({
          tmId: tmIDs[i]._id,
          subject: subjectArray,
          location: locationArray,
          message: message,
          queryData: query
        });
        NotificationService.sendNotification(devicedata.deviceToken, title, message);
      } else {
        const title = 'Notification'
        const message = `Name: ${query.name} Email: ${query.email} Subject: ${subjectArray} Location: ${locationArray}`
        await NotificationModel.create({
          tmId: tmIDs[i]._id,
          subject: subjectArray,
          location: locationArray,
          message: message,
          queryData: query
        });
        // NotificationService.sendNotification(devicedata.deviceToken, title, message);
      }
    }
    console.log('========devicedatadevicedata========', devicedata);
  } catch (error) {
    console.log('==========Error------------', error);
  }

}

async function getTutorId(subject) {
  // console.log('=================', subject);
  const sub = subject.split(',');
  console.log('---------sub-------------', sub)
  let data1 = await subjectModel.find({ subject: {$in: sub} });
  let subjectArray = [];
  await data1.map((subjectData) => {
    subjectArray.push(subjectData._id);
  });
  console.log('========subjectArray==========', subjectArray)
  let userData = await User.find({ subjects: { $in: subjectArray }, isDeleted: false, userType: 'tutor'});
  // console.log('==========userData============', userData);
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
  createNotification
}