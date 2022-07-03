const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const shipperSchema = new mongoose.Schema({
    id_CH: {
        type: ObjectId,
        required: [true]
    },
    HoTen: {
        type: String,
        required: [true]
    },
    Email: {
        type: String,
        required: [true]
    },
    SDT: {
        type: String,
        required: [true]
    },
    NgaySinh: {
        type: String,
        required: [true]
    },
    GioiTinh: {
        type: Number,
        required: [true]
    },
    DiaChiHienTai: {
        type: String,
        required: [true]
    },
})

module.exports = mongoose.model("Shipper", shipperSchema)

