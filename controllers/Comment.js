var utilServices = require(`${appRoot}/services/Util`);
const { constants } = require(`${appRoot}/lib/constants`);
const commentServices = require(`${appRoot}/services/Comment`);

const createComment = async function(req, res){
  try {
    // const tutorId = req.body.tutorId;
    // const managerId = req.body.managerId;
    // const tutorData = await commentServices.getTutorId(tutorId);
    // const managerData = await commentServices.getManagerId(managerId);
    const data = await commentServices.insertComment(req.body);
    return utilServices.successResponse(res, constants.CREATE_COMMENTS, 200, data);
  } catch (error) {
    console.log('-----------', error);
    return utilServices.successResponse(res, constants.DB_ERROR, 500);
  }
}

const getComments = async function(req, res){
    try {
        const data = await commentServices.getComments(req.body);
        return utilServices.successResponse(res, constants.CREATE_COMMENTS, 200, data);
      } catch (error) {
        return utilServices.successResponse(res, constants.DB_ERROR, 500);
      }
}

module.exports = {
    createComment: createComment,
    getComments: getComments
}