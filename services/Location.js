'use strict';

const locationModel = require(`${appRoot}/models/Locations`);
const userModel = require(`${appRoot}/models/User`);

async function checkLocation(location) {
    var data = await locationModel.findOne({
        location: location
    });
    return data;
}

async function insertLocation(params) {
    var obj = {
        location: params.location ? params.location : '',
        managerId: params.managerId ? params.managerId : null,
    };
    return await locationModel.create(obj);
}

async function getLocationList(search, sort, order, perpage, skip) {
    const user = await locationModel.find(search)
        .collation({ 'locale': 'en' })
        .sort({ [sort]: parseInt(order) })
        .skip(skip)
        .limit(perpage);
    return user;
}
async function countList(search) {
    const total = await locationModel.count(search);
    return total;
}

async function removeSingleLocation(locationId) {
    const locationdata = await locationModel.findByIdAndDelete({ _id: locationId });
    return locationdata;
}

async function getSingleLocation(locationId) {
    const locationdata = await locationModel.findById({ _id: locationId });
    return locationdata;
}

async function locationUpdate(updatedata) {
    return await updatedata.save();
}

async function getLocationOfTutors() {
   let data = await userModel.find({userType: "tutor"});
   return data;
}

async function getSingleLocationOfTutor(locationId){
   console.log('================locationId=============', locationId);
   let locationdata = await locationModel.find({_id: {$in: locationId}});
   console.log('----------locationdata--------------', locationdata);
   return locationdata;
}

module.exports = {
    checkLocation,
    insertLocation,
    getLocationList,
    countList,
    removeSingleLocation,
    getSingleLocation,
    locationUpdate,
    getLocationOfTutors,
    getSingleLocationOfTutor
}