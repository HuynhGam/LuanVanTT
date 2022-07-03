const router = require('express').Router()
const uploadImage = require('../middleware/uploadImage')
const uploadCtrl = require('../controllers/uploadController')
const authSeller = require('../middleware/authSeller')
const auth = require('../middleware/auth')

router.post('/upload_image', uploadImage, uploadCtrl.uploadFoodImage)

module.exports = router