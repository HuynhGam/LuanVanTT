import React from 'react';
import { Link} from 'react-router-dom';
import axios from 'axios';
import {useSelector} from 'react-redux'

  
 
export default function Sidebar() {
  // Xử lý đăng xuất
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

     // Lấy thông tin đăng nhập của seller
     const auth = useSelector(state => state.auth);
    
     const {role} = auth;
     
  return (
    <>
      <div id="sidebar" className="active">
        <div className="sidebar-wrapper active">
          <div className="sidebar-header">
            <div className="d-flex justify-content-between">
              <div className="logo">
                <link /><span class="text-1000 fs-3 fw-bold ms-5 text-gradient">oderFood</span>
              </div>
              <div className="toggler">
                <a href="#" className="sidebar-hide d-xl-none d-block"><i className="bi bi-x bi-middle" /></a>
              </div>
            </div>
          </div>
          <div className="sidebar-menu">
            <ul className="menu">
              <li className="sidebar-item active ">
                <Link to = '/admin' className="sidebar-link">
                  <i className="bi bi-grid-fill" />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li className="sidebar-title">Quản lý tài khoản</li>
        
              <li className="sidebar-item  ">
                <Link to = '/user_manager' className="sidebar-link">
                <i className="fa-solid fa-user"></i>
                  <span>Người dùng</span>
                </Link>
              </li>

              <li className="sidebar-item  ">
                <Link to = '/seller_manager' className="sidebar-link">
                <i className="fas fa-utensils"></i>
                  <span>Người bán</span>
                </Link>
              </li>
              <li className="sidebar-title">Quản lý Shipper</li>  
              <li className="sidebar-item  ">
                <Link to = {`/shipper`} className="sidebar-link">
                  <i className ="fa-solid fa-id-badge"></i>
                  <span>Shipper</span>
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
