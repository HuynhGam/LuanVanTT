import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useParams, Link} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux'
import {fetchReq, dispatchGetReq} from '../../redux/actions/orderAction'
import Badge from '@mui/material/Badge';

export default function Sidebar_SL() {

    const auth = useSelector(state => state.auth);
    const {isLogged, role} = auth;
    const email = role.Email
    const order = useSelector(state => state.order);
 
    const [callback] = useState(false);
    const dispatch = useDispatch();

    const signOut = async () => {
        try
            {
                await axios.get('http://localhost:5000/user/logout');
                localStorage.removeItem('firstLogin');
                window.location.href = "/";
            } 
        catch (err) {
                window.location.href = "/";
            }
        }

    useEffect(() => {
        if(isLogged === true){
            return fetchReq(email).then(res =>{
                dispatch(dispatchGetReq(res));
            })   
            
    }},[email, isLogged, dispatch, callback])
    
  return (
    <>
        <div id="sidebar" className="active">
            <div className="sidebar-wrapper active">
            <div className="sidebar-header">
                <div className="d-flex justify-content-between">
                <div className="logo">
                    <link/><span class="text-1000 fs-3 fw-bold ms-5 text-gradient">oderFood</span>
                </div>
                <div className="toggler">
                    <a href="#" className="sidebar-hide d-xl-none d-block"><i className="bi bi-x bi-middle" /></a>
                </div>
                </div>
            </div>
            <div className="sidebar-menu">
                <ul className="menu">
                <li className="sidebar-item active ">
                    <Link to = '/seller' className="sidebar-link">
                    <i className="bi bi-grid-fill" />
                    <span>Dashboard</span>
                    </Link>
                </li>
                <li className="sidebar-title">Cửa hàng</li>
            
                <li className="sidebar-item  ">
                    <Link to = '/store' className="sidebar-link">
                    <i className ="fa-solid fa-shop"></i>
                    <span>Quản lý cửa hàng</span>
                    </Link>
                </li>

                <li className="sidebar-item  ">
                    <Link to = '/add-store' className="sidebar-link">
                    <i className ="fa-solid fa-square-plus"></i>
                    <span>Thêm cửa hàng</span>
                    </Link>
                </li>
                <li className="sidebar-title"></li>
                <li className="sidebar-item  ">
                    {
                        order.length > 0 ?
                        <>
                            <Badge color="secondary" variant="dot">
                                <Link to = {`/req/${role.Email}`} className="sidebar-link">
                                <i className ="fa fa-list-alt"></i>
                                <span>Danh sách yêu cầu</span>
                                </Link>
                            </Badge>
                        </>
                        :
                        <>
                            <Link to = {`/req/${role.Email}`} className="sidebar-link">
                            <i className ="fa fa-list-alt"></i>
                                <span>Danh sách yêu cầu</span>
                            </Link>
                        </>
                    }
                </li>

                <li className="sidebar-item  ">
                    <Link to = {`/order_store/${role.Email}`} className="sidebar-link">
                    <i className ="fa fa-list-alt"></i>
                    <span>Danh sách đơn hàng</span>
                    </Link>
                </li>

                <li className="sidebar-title"></li>
                <li className="sidebar-item  ">
                    <Link to = {`/change-password/${role._id}`} className="sidebar-link">
                    <i className="fa fa-unlock-alt"></i>
                    <span>Đổi mật khẩu</span>
                    </Link>
                </li>
                <li className="sidebar-item  ">
                    <Link onClick={signOut} className="sidebar-link">
                    <i class="fa-solid fa-right-from-bracket"></i>
                    <span>Đăng xuất</span>
                    </Link>
                </li>
                </ul>
            </div>
            <button className="sidebar-toggler btn x"><i data-feather="x" /></button>
            </div>
        </div>

    </>
  );
}
