const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const cartSchema = new mongoose.Schema({   
    id_Email: {
        type: String,
        required: [true]
    },
    id_MonAn: {
        type: ObjectId,
        required: [true]
    },
    SoLuong: {
        type: Number,
        required: [true]
    }
})

module.exports = mongoose.model("GioHang", cartSchema)

