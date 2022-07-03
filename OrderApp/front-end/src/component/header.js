import React, {useEffect, useState} from 'react';
import {Link, useHistory} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import axios from 'axios'
import {Badge, IconButton, Grid, Button} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { styled } from '@mui/material/styles';
import {fetchItem, dispatchGetItem} from '../redux/actions/itemActions'
import {fetchAddress, dispatchGetAddress} from '../redux/actions/addressAction';
import { red } from '@mui/material/colors';

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      right: -5,
      top: 1,
      border: `1px solid ${theme.palette.background.paper}`,
      padding: '0 8px',
    },
  }));  // Shopping cart


export default function Header() {
    const auth = useSelector(state => state.auth);
    const {role, user, isLogged} = auth;
    const id = role._id;

    const item = useSelector(state => state.item);
    const [searchInput, setSearchInput] = useState('null');

    const [callback] = useState(false);
    const dispatch = useDispatch();
    const history = useHistory();


// Xử lý đăng xuất
    const signOut = async () => {
        try {
            await axios.get('http://localhost:5000/user/logout');
            localStorage.removeItem('firstLogin');
            window.location.href = "/";
        } catch (err) {
            window.location.href = "/";
        }
    }

    useEffect(() => {
        if(isLogged){
            return fetchAddress(user._id).then(res =>{
                dispatch(dispatchGetAddress(res))
            })
        }
    },[id, isLogged, dispatch, callback])

    useEffect(() => {
        if(isLogged && role){
            return fetchItem(id).then(res =>{
                dispatch(dispatchGetItem(res));
            })
        }
    },[isLogged, role, dispatch, callback])

  return (
    <header>
        <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top" data-navbar-on-scroll="data-navbar-on-scroll">
            <div className="container"><a className="navbar-brand d-inline-flex" href= ""><span className="text-1000 fs-3 fw-bold ms-2 text-gradient">oderFood</span></a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><span className="navbar-toggler-icon"> </span></button>
                <div className="collapse navbar-collapse border-top border-lg-0 my-2 mt-lg-0" id="navbarSupportedContent">
                <div className="mx-auto pt-5 pt-lg-0 d-block d-lg-none d-xl-block">
                   
                </div>
                <form className="d-flex mt-4 mt-lg-0 ms-lg-auto ms-xl-0">
                <Button onClick={() => history.push(`/result/${searchInput}`)}> <i className="fas fa-search input-box-icon text-primary"/></Button>
                    <Grid sx={{marginRight:-2, marginTop: 1.5, width: 360}} className="input-group-icon pe-2"> 
                        {/* <Link set to = {`/result/${searchInput}`}><i className="fas fa-search input-box-icon text-primary"/></Link> */}
                        <input className="form-control border-0 input-box" type="search" placeholder="Tìm món ăn" aria-label="Search" onChange={(e) => setSearchInput(e.target.value)} />
                    </Grid>

                    {isLogged ?  (
                    <>
                        <Grid className="dropdown ">
                        <a class="btn btn dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span className="btn btn-white shadow-warning text-warning"> {user.Ten} </span>
                        </a>
                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                        <Link className="dropdown-item" to = {`/profile_user/${user._id}`}>
                                            <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400" />
                                            Cá nhân
                                        </Link>

                                        <Link className="dropdown-item" to = {`/address/${user._id}`}>
                                        <i className="fa fa-map-marker fa-sm fa-fw mr-2 text-gray-400" ></i>
                                            Địa chỉ nhận hàng
                                        </Link>

                                        <Link className="dropdown-item" to = {`/your_order/${role.Email}`}>
                                        <i className ="fa fa-check-circle fa-sm fa-fw mr-2 text-gray-400" ></i>
                                            Kiểm tra trạng thái 
                                        </Link>

                                        <Link className="dropdown-item" to = {`/order/${role.Email}`}>
                                        <i className="fa fa-map-marker fa-sm fa-fw mr-2 text-gray-400" ></i>
                                            Đơn hàng của bạn
                                        </Link>

                                        <Link className="dropdown-item" to = {`/password_user/${user._id}`}>
                                        <i className = "fas fa-key fa-sm fa-fw mr-2 text-gray-400"></i>
                                            Đổi mật khẩu
                                        </Link>

                                        <Link className="dropdown-item" onClick={() => signOut()}>
                                        <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400" />
                                            Đăng xuất
                                        </Link>
                   
                            </div>
                        </Grid>

                        <Grid>
                            <IconButton sx={{marginRight: -8, marginTop: 1}}>
                                <StyledBadge badgeContent={item} color= "secondary">
                                <Link to = {`/cart/${role._id}`}> 
                                    <ShoppingCartIcon color="action" />
                                </Link>
                                </StyledBadge>
                            </IconButton>
                        </Grid>

                    </>
                    ) : (
                    <>
                        <Grid sx= {{marginLeft: 5, marginTop: 1}}>
                            <Link to="/login" class="btn btn-white shadow-warning text-warning"> <i class="fas fa-user me-2"></i>Đăng nhập</Link>
                        </Grid>
                        <IconButton aria-label="cart" sx ={{marginLeft:2, marginTop: 1}}>
                            <StyledBadge badgeContent={0}>
                            <Link to = {`/cart/${role._id}`}> 
                                <ShoppingCartIcon color="action" />
                            </Link>
                            </StyledBadge>
                        </IconButton>
                    </>
                    )}
                                        
                </form>  
                </div>
            </div>
        </nav>
    </header>
 
  );
}
