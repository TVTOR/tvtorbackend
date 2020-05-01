var Ouestions = require('../models/Question');
var utilServices = require('../services/Util');
var Location = require('../models/Locations');
var Subject = require('../models/Subjects');
var User = require('../models/User');
var Device = require('../models/Device');
var NotificationModel = require('../models/Notification');
var NotificationServise = require('../services/SendNotification')


// var FCM = require('fcm-node');
// var serverKey = 'AAAABsP6cpA:APA91bFECwaBl8OvwcJPFTAYh_aBl9ntoaUtrPIuSKUo4Uc9Vgf-DpE702wF228VyVVxWPBnhmcIZ_pKjij_qYavmPPUhMFGsHPfVqBZzaLj2zYZJD2-T4zfQUQLZqRe2mYtDBswOu_S'; //put your server key here
// var fcm = new FCM(serverKey);


const createQuestion = async (req, res)=>{
     try {
        var obj = {};
        obj.question = req.body.question;
        obj.no_answer = req.body.no_answer;
        obj.options = req.body.options;
        obj.type = req.body.type;
        obj.title = req.body.title;
        obj.question_num = req.body.question_num;
        obj.optionTable = req.body.optionTable;
        Ouestions.create(obj, (err, data)=>{
            if(err){
                return utilServices.errorResponse(res, "Something went wrong.", 500);
            } else {
                return utilServices.successResponse(res, "Questions created successfully.", 200, data);
            }
        })
     } catch (error) {
        return utilServices.errorResponse(res, "Something went wrong", 400);   
     }
}

const getQuestion = async(req, res)=>{
    try {
        // req.query.email = 'avee@gmail.com'
        // console.log('========req.query.email==============', req.query.email)
        if(req.query.name && req.query.email && req.query.location && req.query.subject){
            createNotification(req.query)
        }
        const detail = {};
        const dataArray = [];
        let questionId = req.query.question;
         const data = await Ouestions.findOne({question_num: questionId});
         dataArray.push(data);
         if(data.no_answer == 1 ){
            questionId = parseInt(questionId)+1;
           const data1 =  await Ouestions.findOne({question_num: questionId});
           dataArray.push(data1);
         }
          detail.data = dataArray;
          if(data.optionTable == "location" || detail.data.length == 2){
             const locationdata = await Location.find({}, { location: 1, _id: 0 });
             locationdata.forEach( (loc)=>{ 
                const ldata = {};
                ldata.text = loc.location
                ldata.value = loc.location
                if(detail.data.length == 2 && detail.data[1].optionTable == "location"){
                    detail.data[1].options.push(ldata);
                }else if(data.optionTable == "location"){
                    detail.data[0].options.push(ldata);
                }
                
             }) 
          }
          if(data.optionTable == "subject" || detail.data.length == 2 ){
            const subjectdata = await Subject.find({}, { subject:1, _id: 0});
            subjectdata.forEach( (sub)=>{ 
                const subData = {};
                subData.text = sub.subject
                subData.value = sub.subject
                if(detail.data.length == 2 && detail.data[1].optionTable == "subject"){
                    detail.data[1].options.push(subData);
                }else if(data.optionTable == "subject"){
                    detail.data[0].options.push(subData);
                }
            }) 
         }

        return utilServices.successResponse(res, "Questions created successfully.", 200, detail);
    } catch (error) {
        console.log(error)
        return utilServices.errorResponse(res, "Something went wrong", 400);
    }
}

const createNotification = async (query)=>{
    const tmIDs = await User.find({location: query.location, isDeleted: false, userType: 'tutormanager', status: true } )
    for(let i = 0; i<tmIDs.length; i++){
      var devicedata =  await Device.findOne({tmId: (tmIDs[i]._id)});
      if(devicedata && devicedata.deviceToken){
      const title = 'Notification'
      const message = `Name: ${query.name}
                       Email: ${query.email}
                       Subject: ${query.subject}
                       Location: ${query.location}`
        await NotificationModel.create({
            tmId: tmIDs[i]._id,
            subject: query.subject,
            location: query.location,
            message: message,
            queryData: query
        })
     NotificationServise.sendNotification(devicedata.deviceToken, title, message);                 
    }
}
}
    
module.exports = {
    createQuestion: createQuestion,
    getQuestion: getQuestion
}