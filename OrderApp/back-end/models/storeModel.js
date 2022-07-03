const mongoose = require('mongoose')

const storeSchema = new mongoose.Schema({
    TenCH: {
        type: String,
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
    SDT: {
        type: String,  
        required: [true]
    },
    TrangThai: {
        type: Number,  
        default: 1 // 0: Nghỉ bán, 1: Còn kinh doanh
    },
})

module.exports = mongoose.model("CuaHang", storeSchema)

