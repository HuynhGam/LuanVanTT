import { BrowserRouter as Router, Switch, Route, Redirect, HashRouter } from "react-router-dom"; 
import React, {useEffect} from 'react';
import axios from 'axios'
import {useDispatch, useSelector} from 'react-redux'
import {dispatchLogin, fetchUser, dispatchGetUser} from './redux/actions/authAction'
import Login from './component/login'
import Register from './component/register'
import ActivationEmail from './component/activationEmail'
import HomePage from './component/homepage'
import Ad_Homepage from './component/admin/homepage'
import Sl_Homepage from './component/seller/homepage'
import Store from './component/seller/store'
import Add_Store from './component/seller/addStore'
import Update_Store from './component/seller/updateStore'
import Update_Menu from './component/seller/updateMenu'
import Update_Info from './component/admin/updateInfo'
import Profile_User from './component/body/profile'
import Password_User from './component/body/password'
import Password_Ad from './component/admin/password'
import Menu from './component/seller/menu'
import Add_Menu from './component/seller/addMenu'
import Cart from './component/body/cart'
import Product from "./component/body/product";
import ForgotPassword from "./component/body/fogotPassword"
import ResetPassword from "./component/body/resetPassword";
import Address from "./component/body/address"
import AddAddress from "./component/body/addAddress"
import UpdateAddress from "./component/body/updateAddress"
import AccountUser from "./component/admin/accountUser"
import AccountSeller from "./component/admin/accountSeller"
import StoreManager from "./component/admin/storeManager"
import InforStore from "./component/body/inforStore"
import Shipper from "./component/admin/shipperManager"
import Add_Shipper from "./component/admin/addShipper"
import Update_Shipper from "./component/admin/updateShipper"
import Result from "./component/body/result"
import OderManager from "./component/body/oderManager"
import ProcessOder from "./component/body/processOder"
import ReqOrder from "./component/seller/reqFood"
import OrderStore from "./component/seller/orderStore"
import DetailOrder from "./component/seller/detailOrder"

axios.defaults.withCredentials = true

function App() {
  const dispatch = useDispatch()
  const token = useSelector(state => state.token)
  const auth = useSelector(state => state.auth)

  useEffect(() => {
    const firstLogin = localStorage.getItem('firstLogin')
    if(firstLogin){
      const getToken = async () => {
        const res = await axios.post('http://localhost:5000/user/refresh_token', null)
        dispatch({type: 'GET_TOKEN', payload: res.data.access_token})
      }
      getToken()
    }
  },[auth.isLogged, dispatch])

  useEffect(() => {
    if(token){
      const getUser = () => {
        dispatch(dispatchLogin())
        return fetchUser(token).then(res => {
          dispatch(dispatchGetUser(res))
        })
      }
      getUser()
    }
  },[token, dispatch])

  
  return (
    <div className="App">
      <HashRouter>
        <Switch>
          <Router>       
                <Route path ="/" exact component={HomePage} />
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
                <Route path="/activate/:activation_token" exact component={ActivationEmail} />
              {/*Cart*/ }
                <Route path="/cart/:id"  render={() => {
                  return localStorage.getItem('firstLogin') ? <Cart/> : <Redirect to = "/login"/> 
                }} /> 
              {/*Homepage Admin */ }
                <Route path="/admin"  render={() => {
                  return localStorage.getItem('firstLogin') ? <Ad_Homepage/> : <Redirect to = "/"/> 
                }} /> 

                <Route path="/seller"  render={() => {
                  return localStorage.getItem('firstLogin') ? <Sl_Homepage/> : <Redirect to = "/"/> 
                }} /> 
              {/*Page Store Manager */ }
                <Route path="/store"  render={() => {
                  return localStorage.getItem('firstLogin') ? <Store/> : <Redirect to = "/"/>
                }} /> 
              {/*Page Add Store */ }
                <Route path="/add-store/"  render={() => {
                  return localStorage.getItem('firstLogin') ? <Add_Store/> : <Redirect to = "/"/>
                }} /> 
              {/*Page Update Store */ }
                <Route path="/update-store/:id"  render={() => {
                  return localStorage.getItem('firstLogin') ? <Update_Store/> : <Redirect to = "/"/>
                }} /> 
              {/*Page Change Password Admin */ }
                <Route path="/change-password/:id"  render={() => {
                  return localStorage.getItem('firstLogin') ? <Password_Ad/> : <Redirect to = "/"/>
                }} /> 
              {/*Page Update Info (Admin) */ }
                <Route  path="/update-info/:id"  render={() => {
                  return localStorage.getItem('firstLogin') ? <Update_Info/> : <Redirect to = "/"/>
                }} /> 
              {/*Page Menu (Seller) */ }
                <Route path="/menu/:id"  render={() => {
                  return localStorage.getItem('firstLogin') ? <Menu/> : <Redirect to = "/"/>
                }} /> 
              {/*Page Add Menu (Seller) */ }
                <Route path="/add-menu/:id"  render={() => {
                    return localStorage.getItem('firstLogin') ? <Add_Menu/> : <Redirect to = "/"/>
                  }} /> 
              {/*Page Update Menu (Seller) */ }
                <Route path="/update-menu/:id"  render={() => {
                  return localStorage.getItem('firstLogin') ? <Update_Menu/> : <Redirect to = "/"/>
                }} /> 
                {/*Page Update Profile (User) */ }
                <Route forceRefresh={true} path="/profile_user/:id"  render={() => {
                  return localStorage.getItem('firstLogin') ? <Profile_User/> : <Redirect to = "/"/>
                }} /> 
                {/*Page Change Password (User) */ }
                <Route path="/password_user/:id"  render={() => {
                  return localStorage.getItem('firstLogin') ? <Password_User/> : <Redirect to = "/"/>
                }} /> 
                {/*Page Change Password (User) */ }
                <Route path="/forgot_password" component={ForgotPassword} />
                {/*Page Reset Password (User) */ }
                <Route path="/reset/:token" component={ResetPassword} />

                <Route path="/address/:id"  render={() => {
                  return localStorage.getItem('firstLogin') ? <Address/> : <Redirect to = "/"/>
                }} />

                <Route path="/user_manager"  render={() => {
                  return localStorage.getItem('firstLogin') ? <AccountUser/> : <Redirect to = "/"/>
                }} />

                <Route path="/seller_manager"  render={() => {
                  return localStorage.getItem('firstLogin') ? <AccountSeller/> : <Redirect to = "/"/>
                }} />

                <Route path="/addAddress/:id" render={() => {
                  return localStorage.getItem('firstLogin') ? <AddAddress/> : <Redirect to = "/"/>
                }} />

                <Route path="/updateAddress/:id" render={() => {
                  return localStorage.getItem('firstLogin') ? <UpdateAddress/> : <Redirect to = "/"/>
                }} />

                <Route path="/store_manager/:id" render={() => {
                  return localStorage.getItem('firstLogin') ? <StoreManager/> : <Redirect to = "/"/>
                }} />

                <Route path="/product/:type" render={() => {
                  return localStorage.getItem('firstLogin') ? <Product/> : <Redirect to = "/"/>
                }} />

                <Route path="/infor_store/:id" render={() => {
                  return localStorage.getItem('firstLogin') ? <InforStore/> : <Redirect to = "/"/>
                }} />    

                <Route path="/shipper" render={() => {
                  return localStorage.getItem('firstLogin') ? <Shipper/> : <Redirect to = "/"/>
                }} />       

                <Route path="/add_shipper" render={() => {
                  return localStorage.getItem('firstLogin') ? <Add_Shipper/> : <Redirect to = "/"/>
                }} />

                <Route path="/update_shipper/:id" render={() => {
                  return localStorage.getItem('firstLogin') ? <Update_Shipper/> : <Redirect to = "/"/>
                }} />

                <Route path="/result/:searchInput" render={() => {
                  return localStorage.getItem('firstLogin') ? <Result/> : <Redirect to = "/"/>
                }} />

                <Route path="/infor_store/:id" render={() => {
                  return localStorage.getItem('firstLogin') ? <InforStore/> : <Redirect to = "/"/>
                }} />

                <Route path="/order/:email" render={() => {
                  return localStorage.getItem('firstLogin') ? <OderManager/> : <Redirect to = "/"/>
                }} />

                <Route path="/your_order/:email" render={() => {
                  return localStorage.getItem('firstLogin') ? <ProcessOder/> : <Redirect to = "/"/>
                }} />

                <Route path="/req/:email" render={() => {
                  return localStorage.getItem('firstLogin') ? <ReqOrder/> : <Redirect to = "/"/>
                }} />

                <Route path="/order_store/:id" render={() => {
                  return localStorage.getItem('firstLogin') ? <OrderStore/> : <Redirect to = "/"/>
                }} />

                <Route path="/detail_order/:id" render={() => {
                  return localStorage.getItem('firstLogin') ? <DetailOrder/> : <Redirect to = "/"/>
                }} />

          </Router>
        </Switch>
        </HashRouter>
        <div className="App-content">
         
        </div>
      </div> 
      
    );  
}

export default App;
