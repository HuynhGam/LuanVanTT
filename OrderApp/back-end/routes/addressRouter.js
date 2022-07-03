// Đường dẫn API của web
const router = require('express').Router()
const auth = require('../middleware/auth')
const addCtrl = require('../controllers/addressController')


router.post('/add_address', addCtrl.addAddress)

router.patch('/update_address/:id', auth, addCtrl.updateAddress)

router.patch('/get_address/:id', addCtrl.getAddress)

router.patch('/remove_address/:id', addCtrl.removeAddress)


module.exports = router  