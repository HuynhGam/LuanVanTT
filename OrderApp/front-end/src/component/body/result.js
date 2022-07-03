import React, { useEffect, useState} from 'react';
import axios from 'axios';
import { useHistory, useParams, Link} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux'
import Header from '../header'
import Footer from '../footer';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {Box, Button, Grid, Typography} from '@mui/material';
import {fetchSearch, dispatchSearch} from '../../redux/actions/searchAction'


export default function Result() {

    const {searchInput} = useParams();

    const auth = useSelector(state => state.auth);
    const {role, isLogged} = auth;

    const [callback,setCallback] = useState(false);
    const dispatch = useDispatch();

    const result = useSelector(state => state.result);


    useEffect(() =>{
        if(isLogged){       
            return fetchSearch(searchInput).then(res =>{
                dispatch(dispatchSearch(res));
            }) 
        }
    }, [searchInput, isLogged, dispatch])


  return (
    <div id="wrapper">  
        <div id="content-wrapper">  
            <Header />
            <div id="content"> 
            {   searchInput === 'null' ? 
                <>
                    <Typography variant="h4" sx={{marginLeft: 6, marginTop:15, marginBlockEnd: 50 }}>Kết quả tìm kiếm: {searchInput}</Typography>
                </>
                :
                <>
                    <Typography variant="h4" sx={{marginLeft: 6, marginTop:15}}>Kết quả tìm kiếm: {searchInput}</Typography>
                    <Grid container spacing={2} sx = {{marginLeft:2, marginTop:3}}> 
                        {
                            result.length > 0 ? (
                            result.map(food_store =>              
                                <Grid item md={3}>
                                    <Box
                                        sx={{
                                            bgcolor: 'background.paper',
                                            boxShadow: 1,
                                            borderRadius: 4,
                                            p: 1,
                                            width: 345,
                                            height: 475,
                                            marginBlockEnd:'120px',
                                            
                                        }}
                                    >
                                        <Box>
                                            <img src = {food_store.HinhAnh}  width = {327} height = {218} className="rounded" ></img>
                                            <Typography sx={{fontSize: 20, alignItems: "Left"}}> {food_store.TenMonAn} </Typography>
                                            {/* Trạng thái = 1: còn món, Trạng thái != 1: hết món */}
                                            {food_store.TrangThai === 1 ? <span className="badge badge-secondary">Còn món </span>: <span className ="badge badge-pill badge-danger">Hết món</span>}
                                            {food_store.SoLuongCon <= 10 && food_store.SoLuongCon > 0 ? <span className="badge badge-pill badge-danger">Còn {food_store.SoLuongCon} món </span>: ""}
                                            <Typography sx={{fontSize: 17, alignItems: "Left" }}>{food_store.GiaBan.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</Typography>
                                            <Typography sx={{fontSize: 17, alignItems: "Left" }}> <Link to ={`/infor_store/${food_store.id_CH}`} className='text-primary'>{food_store.TenCH}</Link></Typography>
                                            <Typography  sx={{fontSize: 17, alignItems: "Left"}}>Mô tả:</Typography>
                                            <Typography  sx={{fontSize: 17, alignItems: "Left"}}>{food_store.MoTa ?  food_store.MoTa : <><br/></>}</Typography>
                                            <Box sx={{ '& button': { margin: 2} }}>
                                                {
                                                    food_store.TrangThai === 1  ? // 1: Còn món, != 1: Hết món (disabled button )
                                                    <>
                                                    <Button sx ={{backgroundColor: '#FFB30E'}} variant="contained" size="medium"onClick= {
                                                            async e => {
                                                                try {
                                                                    await axios.post("http://localhost:5000/store/add_cart", {
                                                                        id_Email: role._id,
                                                                        id_MonAn: food_store._id,
                                                                        SoLuong: 1                                                         
                                                                    });
                                                                    alert('Thao tác thành công')
                                                                    setTimeout(() => {
                                                                        window.location.href = `/cart/${role._id}`
                                                                    }, 500);   
                                                                } catch (err) {
                                                                    alert(err)
                                                                }
                                                                }
                                                        }>
                                                            Mua ngay 
                                                        </Button>
                                                        <Button sx ={{backgroundColor: '#FFB30E'}} variant="contained" size="medium" onClick= {
                                                            async e => {
                                                                try {
                                                                    await axios.post("http://localhost:5000/store/add_cart", {
                                                                        id_Email: role._id,
                                                                        id_MonAn: food_store._id,
                                                                        SoLuong: 1                                                         
                                                                    });
                                                                    alert('Thao tác thành công')   
                                                                } catch (err) {
                                                                    alert(err)
                                                                }
                                                                }
                                                        }>
                                                            Thêm giỏ hàng
                                                        </Button>
                                                    </> : 
                                                    <>
                                                        <Button disabled sx ={{backgroundColor: '#FFB30E'}} variant="contained" size="medium">
                                                            Mua ngay 
                                                        </Button>
                                                        <Button  disabled sx ={{backgroundColor: '#FFB30E'}} variant="contained"  size="medium">
                                                            Thêm giỏ hàng
                                                        </Button>
                                                    </>
                                                }                                    
                                            </Box>
                                        </Box>                                                  
                                    </Box>  
                                </Grid> 
                            ))
                            : 
                            <><Typography variant="h4" sx={{marginLeft: 6, marginTop:15, marginBlockEnd: 30 }}>Chúng tôi không tìm thấy món ăn mà bạn yêu cầu :(</Typography></>
                        }                 
                </Grid> 
                </>
            }
            </div>
        </div>
        <Footer/> 
    </div>
  );
}
