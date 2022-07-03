require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')

const app = express()
app.use(express.json())
app.use(cors({
    origin: `${process.env.CLIENT_URL}`,
    credentials: true
}))
app.use(cookieParser())
app.use(fileUpload({
    useTempFiles: true
}))


//Routes
app.use('/user', require('./routes/userRouter'))
app.use('/store', require('./routes/storeRouter'))
app.use('/address', require('./routes/addressRouter'))
app.use('/api', require('./routes/uploadRouter'))

//Kết nối CSDL mongoo
const URI = process.env.MONGODB_URL
mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if(err) throw err;
    console.log("Connected to mongodb")
})


const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log('Server is running on port', PORT)
})

