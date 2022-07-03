// Đường dẫn API của web
const router = require('express').Router()
const userCtrl = require('../controllers/userController')
const storeCtrl = require('../controllers/storeController')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')
const authSeller = require('../middleware/authSeller')


router.post('/register', userCtrl.register)

router.post('/activation', userCtrl.activateEmail)

router.post('/login', userCtrl.login)

router.post('/refresh_token', userCtrl.getAccessToken)

router.post('/forgot', userCtrl.forgotPassword)

router.post('/reset', auth, userCtrl.resetPassword)
 
router.get('/infor', auth, userCtrl.getUser)

router.get('/all_infor', userCtrl.getUsersAllInfor)

router.get('/count', userCtrl.countAccount)

router.patch('/update_info/:id', auth, userCtrl.updateUserInfor)

router.patch('/update/:id', auth, userCtrl.updateInfor)

router.patch('/change_password/:id', auth, userCtrl.changePassword) 

router.get('/all_store/:id', userCtrl.getStoresAllInfor)

router.post('/add_shipper', userCtrl.addShipper)

router.get('/shipper', userCtrl.getShipperInfor)

router.patch('/password_shipper/:id', userCtrl.resetPasswordShipper)

router.patch('/update_shipper/:id', userCtrl.updateShipperInfor)

router.get('/stores', auth, userCtrl.getStores)
// Đăng xuất
router.get('/logout', userCtrl.logout)

module.exports = router  