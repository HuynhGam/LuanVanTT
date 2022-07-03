const { truncateSync } = require('fs');
const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const rateSchema = new mongoose.Schema({
    id_CH:{
        type: ObjectId,
        required: [true]
    },
    MonAn: {
        type: String,
        required: [true]
    },
    Sao: {
        type: Number,
        required: [true]
    },
    DanhGia: {
        type: String,
        default: ""
    },
    Email_DG: {
        type: String,
        required: [true]
    }
})

module.exports = mongoose.model("DanhGia", rateSchema)

