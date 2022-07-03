const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema({
    id_KH: {
        type: String
    }, 
    SoNha: {
        type: String,
        default: null
    },
    DiaChi: {
        type: String,
        required: [true]
    }
})

module.exports = mongoose.model("DiaChi", addressSchema)

