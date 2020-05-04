var Subjects = require('../models/Subjects');
var utilServices = require('../services/Util');

const createSubjects = async function(req, res){
    try {
      console.log('===================');
        var obj = {};
        obj.subject = req.body.subject;
        const criteria = {
          subject: req.body.subject
        } 
        const checkSubject = await Subjects.findOne(criteria);
        if(checkSubject){
          return utilServices.errorResponse(res, "This subject already created.", 409);
        }
        Subjects.create(obj, (err, data)=>{
            if(err){
                return utilServices.errorResponse(res, "Something went wrong.", 500);
            } else {
                return utilServices.successResponse(res, "Subject created successfully.", 200, data);
            }
        })
    } catch (error) {
        return utilServices.errorResponse(res, "Something went wrong.", 500);
    }
}


const getAllSubjects = async function (req, res){
    try {
    const query = req.query;
    const perpage = parseInt(query.length);
    const skip = parseInt(query.start)
    const search = {};
    const order = (query.dir == 'asc') ? 1: -1;
    let sort = 'createdAt'; 
    if(parseInt(query.column) == 1){
      sort = 'subject'
    }
    if (query.searchdata) {
      if (query.searchdata.length > 0) {
        var value = new RegExp("^" + query.searchdata, "i");
        search['$or'] = [{ name: value }, { email: value }];
      }
    }
    const total = await Subjects.count(search);
        await Subjects.find(search)
        .collation({'locale':'en'})
        .sort({  [sort] : parseInt(order) })
        .skip(skip)
        .limit(perpage)
        .exec((err, data)=>{
              if(err){
                return utilServices.errorResponse(res, "Something went wrong.", 500);
              } else {
                if(!data.length){
                  return utilServices.errorResponse(res, "Data not found.", 500);
                } else {
                  return utilServices.successResponse(res, "Data found.", 200, {data: data, total: total});
                }
              }
         })
    } catch (error) {
      return utilServices.errorResponse(res, "Something went wrong.", 500);
    }
  }

  const updateSubjects = function(req, res){
    try {
      var subjectId = req.params.id;
      Subjects.findById({_id: subjectId}, (err, updateData)=>{
        if(err){
          return utilServices.errorResponse(res, "Something went wrong.", 500);
        } else {
          if(!updateData){
            utilServices.errorResponse(res, "Data not found.", 500);
          } else {
            if(req.body.subject){
              updateData.subject = req.body.subject
            }
           updateData.save((err, data) => {
            if (err) {
                utilServices.errorResponse(res, "Somthing went wrong", 500);
            } else {
                utilServices.successResponse(res, "Data updated successfully", 200, data);
            }
        })
          }
        }
      })
    } catch (error) {
      return utilServices.errorResponse(res, "Something went wrong.", 500);
    }
  }

  const deleteSubjects = function(req, res){
    try {
      var subjectId = req.params.id;
      Subjects.findByIdAndDelete({_id: subjectId}, (err, data)=>{
        if(err){
          return utilServices.errorResponse(res, "Something went wrong.", 500);
        } else {
          if(!data){
            return utilServices.errorResponse(res, "Data not found.", 404);
          } else {
            return utilServices.successResponse(res, "Data deleted successfully.", 200);
          }
        }
      })
    } catch (error) {
      return utilServices.errorResponse(res, "Something went wrong.", 500);
    }
  }

  const getSingleSubject = function(req, res){
    try {
      var subjectId = req.params.id;
      Subjects.findById({_id: subjectId}, (err, data)=>{
        if(err){
          return utilServices.errorResponse(res, "Something went wrong.", 500);
        } else {
          if(!data){
            return utilServices.errorResponse(res, "Data not found.", 404);
          } else {
            return utilServices.successResponse(res, "Data found.", 200, data);
          }
        }
      })
    } catch (error) {
      return utilServices.errorResponse(res, "Something went wrong.", 500);
    }
  }

module.exports = {
    createSubjects: createSubjects,
    getAllSubjects: getAllSubjects,
    deleteSubjects: deleteSubjects,
    updateSubjects: updateSubjects,
    getSingleSubject: getSingleSubject
}