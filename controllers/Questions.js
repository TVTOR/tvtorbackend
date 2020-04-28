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

          if(data.optionTable == "location"){
             const locationdata = await Location.find({}, { location: 1, _id: 0 });
             let locData = [];
             const ldata = {};
             locationdata.forEach( (loc)=>{ 
                ldata.text = loc.location
                ldata.value = loc.location
                locData.push(ldata);
             }) 
             detail.location = locData
          }
          
          if(data.optionTable == "subject"){
            const subjectdata = await Subject.find({}, { subject:1, _id: 0});
            let subDetails = [];
            subjectdata.forEach( (sub)=>{ 
                const subData = {};
                console.log(sub.subject)
                subData.text = sub.subject
                subData.value = sub.subject
                subDetails.push(subData);
            }) 
            detail.subject = subDetails;
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