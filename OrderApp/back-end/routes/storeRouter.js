// Đường dẫn API của web
const router = require('express').Router()
const auth = require('../middleware/auth')
const authSeller = require('../middleware/authSeller')
const uploadImage = require('../middleware/uploadImage')
const storeCtrl = require('../controllers/storeController')


router.post('/create_shop', storeCtrl.create_store)

router.patch('/update_shop/:id', auth, storeCtrl.update_store)

router.post('/create_food', storeCtrl.create_food)

router.patch('/get_menu/:id', storeCtrl.get_menu)

router.patch('/get_food/:type', storeCtrl.get_food)

router.patch('/update_menu/:id', auth,  storeCtrl.update_menu)

router.get('/all_menu', auth, storeCtrl.get_Allmenu)

router.post('/add_cart', storeCtrl.add_cart)

router.post('/add_detail', storeCtrl.add_detail)

router.patch('/cart/:id', storeCtrl.get_Cart)

router.patch('/remove_food/:id', storeCtrl.remove_Cart)

router.get('/count', storeCtrl.count_Store)

router.patch('/count_stores/:Email', storeCtrl.count_Stores)

router.patch('/count_item/:id', storeCtrl.count_Item)

router.patch('/update/:id', storeCtrl.update_cart)

router.patch('/get_store/:id', storeCtrl.get_store)

router.post('/search', storeCtrl.search_food)

router.post('/add_oder', storeCtrl.add_order)

router.post('/add_detail', storeCtrl.add_detail)

router.post('/add_rate', storeCtrl.add_rating)

router.patch('/get_rate/:id', storeCtrl.get_rating)

router.patch('/get_oder/:id', storeCtrl.get_oder)

router.patch('/process_oder/:id', storeCtrl.process_oder)

router.patch('/cancel/:id', storeCtrl.cancel_oder)

router.patch('/req/:id', storeCtrl.get_req)

router.post('/send_req', storeCtrl.send_reqOder)

router.patch('/confirm/:id', storeCtrl.confirm_Order)

router.patch('/order_store/:id', storeCtrl.order_store)

router.patch('/cannel_order/:id', storeCtrl.cannel_store)


module.exports = router  