var Locations = require('../models/Locations');
var utilServices = require('../services/Util');

const createLocations = async function(req, res){
    try {
        var obj = {};
        obj.location = req.body.location;
        Locations.create(obj, (err, data)=>{
            if(err){
                return utilServices.errorResponse(res, "Something went wrong.", 500);
            } else {
                return utilServices.successResponse(res, "Location created successfully.", 200, data);
            }
        })
    } catch (error) {
        return utilServices.errorResponse(res, "Something went wrong.", 500);
    }
}


const getAllLocations = async function (req, res){
    try {
        await Locations.find({}, (err, data)=>{
              if(err){
                return utilServices.errorResponse(res, "Something went wrong.", 500);
              } else {
                if(!data.length){
                  return utilServices.errorResponse(res, "Data not found.", 500);
                } else {
                  return utilServices.successResponse(res, "Data found.", 200, data);
                }
              }
         })
    } catch (error) {
      return utilServices.errorResponse(res, "Something went wrong.", 500);
    }
  }

  const updateLocations = function(req, res){
    try {
      var locationId = req.params.id;
      Locations.findById({_id: locationId}, (err, updateData)=>{
        if(err){
          return utilServices.errorResponse(res, "Something went wrong.", 500);
        } else {
          if(!updateData){
            utilServices.errorResponse(res, "Data not found.", 500);
          } else {
            if(req.body.location){
              updateData.location = req.body.location
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

  const deleteLocations = function(req, res){
    try {
      var locationId = req.params.id;
      Subjects.findByIdAndDelete({_id: locationId}, (err, data)=>{
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

module.exports = {
    createLocations: createLocations,
    getAllLocations: getAllLocations,
    deleteLocations: deleteLocations,
    updateLocations: updateLocations
}