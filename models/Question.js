var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Questions = new Schema({
    question: { type: String },
    no_answer: { type: Number, default: 0 },
    options: { type: Array },
    type: { type: String },
    title: { type: String },
    optionTable: { type: String },
    question_num: { type: Number }
}, { timestamps: true })

module.exports = mongoose.model('Questions', Questions);