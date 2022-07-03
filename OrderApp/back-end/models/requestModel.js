const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const requestSchema = new mongoose.Schema({
    id_Shipper: {
        type: ObjectId,
        required: [true]
    },
    id_DH: {
        type: String,
        required: [true]
    },
    TrangThai: {
        type: Number,
        default: 0, //0: Chưa nhận, 1: Đã nhận
        required: [true]
    }
})

module.exports = mongoose.model("DanhSachYeuCau",  requestSchema)

