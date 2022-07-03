import React, {useEffect, useState} from 'react';
import { useHistory } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux'
import {fetchAllUsers, dispatchGetAllUsers} from '../../redux/actions/userAction'
import {fetchCount, dispatchGetCount} from '../../redux/actions/countAction'
import {fetchCountStore, dispatchGetCountStore} from '../../redux/actions/ctStoreAction'
import Sidebar from './sidebar';

export default function Ad_Homepage() {

    const auth = useSelector(state => state.auth);
    const token = useSelector(state => state.token);
    const {isAdmin} = auth;

    const account = useSelector(state => state.account);
    const total_store = useSelector(state => state.total_store);
    const [callback] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if(isAdmin){
            return fetchAllUsers(token).then(res =>{
                dispatch(dispatchGetAllUsers(res));
            })
        }
    },[token, isAdmin, dispatch, callback])

    useEffect(() => {
        if(isAdmin){
            return fetchCount().then(res =>{
                dispatch(dispatchGetCount(res));
            })
        }
    },[isAdmin, dispatch, callback])

    useEffect(() => {
        if(isAdmin){
            return fetchCountStore().then(res =>{
                dispatch(dispatchGetCountStore(res));
            })
        }
    },[isAdmin, dispatch, callback])


    // Khởi tạo history để tạo đường dẫn 
    const history = useHistory()

  return (
    <>
    <div id="app">
        <div id="sidebar" class="active">
            <Sidebar/>
        </div>

        <div id="main">
    
            <div className="page-heading pb-2 mt-4 mb-2 border-bottom">
                <h3>Xin chào bạn</h3>
            </div>
            <div class="page-content">
                <section class="row">
                    <div class="col-10 col-lg-14">
                        <div className="row">
                            <div className="col-6 col-lg-3 col-md-6">
                                <div className="card">
                                    <div className="card-body px-3 py-4-5">
                                        <div className="row">
                                        <div className="col-md-4">
                                            <div className="stats-icon purple">
                                            <i class="fa-solid fa-users"></i>
                                            </div>
                                        </div>
                                        <div className="col-md-8">
                                            <h6 className="text-muted font-semibold">Tài khoản người dùng</h6>
                                            <h6 className="font-extrabold mb-0">{account.user}</h6>
                                        </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-lg-3 col-md-6">
                                <div className="card">
                                <div className="card-body px-3 py-4-5">
                                    <div className="row">
                                    <div className="col-md-4">
                                        <div className="stats-icon blue">
                                            <i class='fas fa-concierge-bell'></i>
                                        </div>
                                    </div>
                                    <div className="col-md-8">
                                        <h6 className="text-muted font-semibold">Tài khoản người bán</h6>
                                        <h6 className="font-extrabold mb-0">{account.seller}</h6>
                                    </div>
                                    </div>
                                </div>
                                </div>
                            </div>
                            <div className="col-6 col-lg-3">
                                <div className="card">
                                <div className="card-body px-3 py-4-5">
                                    <div className="row">
                                    <div className="col-md-4">
                                        <div className="stats-icon green">
                                        <i class="fa-solid fa-store"></i>
                                        </div>
                                    </div>
                                    <div className="col-md-8">
                                        <h6 className="text-muted font-semibold">Tổng cửa hàng</h6>
                                        <h6 className="font-extrabold mb-0">{total_store.total}</h6>
                                    </div>
                                    </div>
                                </div>
                                </div>
                            </div>
                            <div className="col-6 col-lg-3 col-md-6">
                                <div className="card">
                                <div className="card-body px-3 py-4-5">
                                    <div className="row">
                                    <div className="col-md-4">
                                        <div className="stats-icon red">
                                        <i class="fa-solid fa-money-bill-trend-up"></i>
                                        </div>
                                    </div>
                                    <div className="col-md-8">
                                        <h6 className="text-muted font-semibold">Còn kinh doanh</h6>
                                        <h6 className="font-extrabold mb-0">{total_store.business}</h6>
                                    </div>
                                    </div>
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>               
                </section>
            </div>
        </div>
    </div>
        
    </>
  );
}
