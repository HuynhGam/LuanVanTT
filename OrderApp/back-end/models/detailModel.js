const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const detailSchema = new mongoose.Schema({
    id_DH: {
        type: String,
        required: [true]
    },
    id_MonAn: {
        type: ObjectId,
        required: [true]
    },
    GiaBan: {
        type: Number,
        required: [true]
    },
    SoLuong: {
        type: Number,
        required: [true]
    }
})

module.exports = mongoose.model("ChiTietDonHang", detailSchema)

