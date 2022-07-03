const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const menuSchema = new mongoose.Schema({
    id_CH: {
        type: ObjectId,
        required: [true]
    },
    TenMonAn: {
        type: String,
        required: [true]
    },
    Loai: {
        type: String
    },
    MoTa: {
        type: String    
    },
    HinhAnh: {
        type: String,
        required: [true]
    },
    GiaBan: {
        type: Number,
        required: [true]
    },
    TrangThai: {
        type: Number,  
        default: 1 // 0: Hết món, 1: Còn món
    },
    SoLuongCon: {
        type: Number,  
        default: 30
    },
})

module.exports = mongoose.model("Menu", menuSchema)

