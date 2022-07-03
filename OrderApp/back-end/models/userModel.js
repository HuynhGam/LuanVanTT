const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    Ten: {
        type: String,
        default: ""
    },
    Email: {
        type: String,
        required: [true],
        trim: true, // Email là duy nhất và không được trùng
        unique: true
    }, 
    SDT: {
        type: String,  
        default: ""
    }
})

module.exports = mongoose.model("ThongTin", userSchema)

