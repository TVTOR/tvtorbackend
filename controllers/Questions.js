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

module.exports = {
    createQuestion: createQuestion,
    getQuestion: getQuestion
}