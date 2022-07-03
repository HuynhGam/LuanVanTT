import { combineReducers } from 'redux'
import auth from './authReducers'
import token from './tokenReducers'
import infor from './usersReducers'
import stores from './storeReducers'
import menu from './menuReducers'
import food from './foodReducers'
import cart from './cartReducers'
import address from './addressReducers'
import account from './countReducers'
import total_store from './ctStoreReducers'
import item from './itemReducers'
import shippers from './shipperReducers'
import result from './searchReducers'
import rating from './rateReducers'
import order from './orderReducers'
import order_cannel from './order_cannel'
import order_succ from './order_succ'

// khởi tạo biến trên redux
export default combineReducers({
    auth,
    token,
    infor,
    account,
    total_store,
    address,
    stores,
    menu,
    food,
    cart,
    item,
    shippers,
    result,
    rating,
    order,
    order_cannel,
    order_succ
})