const mongoose = require('mongoose')

const accSchema = new mongoose.Schema({
    Email: {
        type: String,
        required: [true],
        trim: true, // Email là duy nhất và không được trùng
        unique: true
    }, 
    MatKhau: {
        type: String,
        required: [true]
    },
    VaiTro: {
        type: Number,
        default: 1 // 0 = admin, 1 = user, 2 = seller
    },
    TrangThai: {
        type: Number,
        default: 1 // 0: Off, 1: Onl
    }
})

module.exports = mongoose.model("TaiKhoan", accSchema)

