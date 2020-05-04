var Locations = require('../models/Locations');
var utilServices = require('../services/Util');

const createLocations = async function(req, res){
    try {
        var obj = {};
        obj.location = req.body.location;
        const criteria = {
          location: req.body.location
        } 
        const checkLocation = await Locations.findOne(criteria);
        if(checkLocation){
          return utilServices.errorResponse(res, "This location already created.", 409);
        }
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


// const getAllLocations = async function (req, res){
//     try {
//         await Locations.find({}, (err, data)=>{
//               if(err){
//                 return utilServices.errorResponse(res, "Something went wrong.", 500);
//               } else {
//                 if(!data.length){
//                   return utilServices.errorResponse(res, "Data not found.", 500);
//                 } else {
//                   return utilServices.successResponse(res, "Data found.", 200, data);
//                 }
//               }
//          })
//     } catch (error) {
//       return utilServices.errorResponse(res, "Something went wrong.", 500);
//     }
//   }


const getAllLocations = async function (req, res){
  try {
  const query = req.query;
  const perpage = parseInt(query.length);
  const skip = parseInt(query.start)
  const search = {};
  const order = (query.dir == 'asc') ? 1: -1;
  let sort = 'createdAt'; 
  if(parseInt(query.column) == 1){
    sort = 'location'
  }
  if (query.searchdata) {
    if (query.searchdata.length > 0) {
      var value = new RegExp("^" + query.searchdata, "i");
      search['$or'] = [{ name: value }, { email: value }];
    }
  }
  const total = await Locations.count(search);
      await Locations.find(search)
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
      Locations.findByIdAndDelete({_id: locationId}, (err, data)=>{
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
      console.log('-----------------', error);
      return utilServices.errorResponse(res, "Something went wrong.", 500);
    }
  }


  const getSingleLocation = async function(req, res){
    try {
      var locationId = req.params.id;
      await Locations.findById({_id: locationId}, (err, data)=>{
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
    createLocations: createLocations,
    getAllLocations: getAllLocations,
    deleteLocations: deleteLocations,
    updateLocations: updateLocations,
    getSingleLocation: getSingleLocation
}