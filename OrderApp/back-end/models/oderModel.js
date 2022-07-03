const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const oderSchema = new mongoose.Schema({
    id_DH:{
        type: String,
        required: [true]
    },
    id_CH:{
        type: ObjectId,
        required: [true]
    },
    id_Shipper: {
        type: ObjectId,
        required: [true]
    },
    Email: {
        type: String,
        required: [true]
    },
    DiaChi: {
        type: String,
        required: [true]
    },
    NgayDat: {
        type: Date,
        default: Date.now,
        required: [true]
    },
    TrangThai: {
        type: Number,
        default: 1,
        required: [true]
    },
    PhiShip: {
        type: Number,
        required: [true]
    },
    ThanhToan: {
        type: Number,
        required: [true]
    },
    TongCong: {
        type: Number,
        required: [true]
    }
})

module.exports = mongoose.model("DonHang", oderSchema)

