'use strict';

const subjectModel = require(`${appRoot}/models/Subjects`);

async function checkSubject(subject) {
    var data = await subjectModel.findOne({
        subject: subject
    });
    return data;
}
async function insertSubject(params) {
    var obj = {
        subject: params.subject ? params.subject : '',
        colorcode: params.colorcode ? params.colorcode : ''
    };
    return await subjectModel.create(obj);
}

async function getSubjectsList(search, sort, order, perpage, skip) {
    const user = await subjectModel.find(search)
        .collation({ 'locale': 'en' })
        .sort({ [sort]: parseInt(order) })
        .skip(skip)
        .limit(perpage);
    return user;
}
async function countList(search) {
    const total = await subjectModel.count(search);
    return total;
}

async function removeSingleSubject(subjectId) {
    const subjectdata = await subjectModel.findByIdAndDelete({ _id: subjectId });
    return subjectdata;
}

async function getSingleSubject(subjectId) {
    const subjectdata = await subjectModel.findById({ _id: subjectId });
    return subjectdata;
}

async function subjectUpdate(updatedata) {
    return await updatedata.save();
}

module.exports = {
    checkSubject,
    insertSubject,
    getSubjectsList,
    countList,
    removeSingleSubject,
    getSingleSubject,
    subjectUpdate
}