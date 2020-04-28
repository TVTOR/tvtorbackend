var Ouestions = require('../models/Question');
var utilServices = require('../services/Util');
var Location = require('../models/Locations');
var Subject = require('../models/Subjects');

const createQuestion = async (req, res)=>{
     try {
        var obj = {};
        obj.question = req.body.question;
        obj.no_answer = req.body.no_answer;
        obj.options = req.body.options;
        obj.type = req.body.type;
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
        const detail = {};
        const dataArray = [];
        const questionId = req.query.question;
         const data = await Ouestions.findOne({question_num: questionId});
         dataArray.push(data);
         if(req.query.question == 4 && data.no_answer == 1 ){
           const data1 =  await Ouestions.findOne({question_num: 2});
           dataArray.push(data1);
         }
         if(req.query.question == 7 && data.no_answer == 1 ){
            const data1 =  await Ouestions.findOne({question_num: 8});
            dataArray.push(data1);
          }
          detail.data = dataArray;

          if(data.optionTable == "location"){
             const locationdata = await Location.find({}, { location: 1, _id: 0 });
             detail.locationdata = locationdata;
          }
          if(data.optionTable == "subject"){
            const subjectdata = await Subject.find({}, { subject:1, _id: 0});
            detail.subjectdata = subjectdata
         }
        return utilServices.successResponse(res, "Questions created successfully.", 200, detail);
    } catch (error) {
        return utilServices.errorResponse(res, "Something went wrong", 400);
    }
}

module.exports = {
    createQuestion: createQuestion,
    getQuestion: getQuestion
}