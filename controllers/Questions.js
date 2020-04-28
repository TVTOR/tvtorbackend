var Ouestions = require('../models/Question');
var utilServices = require('../services/Util');


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
        const questionId = req.query.question;
         const data = await Ouestions.findOne({question_num: questionId})
        return utilServices.successResponse(res, "Questions created successfully.", 200, data);
    } catch (error) {
        return utilServices.errorResponse(res, "Something went wrong", 400);
    }
}

module.exports = {
    createQuestion: createQuestion,
    getQuestion: getQuestion
}