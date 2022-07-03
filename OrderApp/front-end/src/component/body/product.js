import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useParams, Link} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux'
import Header from '../header'
import Footer from '../footer';
import {Box, Button, Stack, Typography, Paper, Grid} from '@mui/material';
import { styled } from '@mui/material/styles';
import {fetchFood, dispatchGetFood} from '../../redux/actions/foodAction'


export default function Product() {

    const {type} = useParams();
    const food = useSelector(state => state.food);
    
    const auth = useSelector(state => state.auth);
    const {role, isLogged} = auth;

    const [callback,setCallback] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if(isLogged){
            return fetchFood(type).then(res =>{
                dispatch(dispatchGetFood(res));
            })
        } 
    },[isLogged, dispatch, callback])


  return (
    <>
        <div id="wrapper">  
            <div id="content-wrapper">  
            <Header />
                <div id="content">  
                <Typography variant="h4" sx={{marginLeft: 6, marginTop:15 }}>Danh sách món: {type}</Typography>
                <Grid container spacing={2} sx = {{marginLeft:2, marginTop:3}}> 
                        {
                            food.map( store =>
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
                                    <img src = {store.HinhAnh}  width = {327} height = {218} className="rounded" ></img>
                                    <Typography sx={{fontSize: 20, alignItems: "Left"}}> {store.TenMonAn} </Typography>
                                    {/* Trạng thái = 1: còn món, Trạng thái != 1: hết món */}
                                    {store.TrangThai === 1 ? <span className="badge badge-secondary">Còn món </span>: <span className ="badge badge-pill badge-danger">Hết món</span>}
                                    {store.SoLuongCon <= 10 && store.SoLuongCon > 0 ? <span className="badge badge-pill badge-danger">Còn {store.SoLuongCon} phần </span>: ""}
                                    <Typography sx={{fontSize: 17, alignItems: "Left" }}>{store.GiaBan.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</Typography>
                                    <Typography sx={{fontSize: 17, alignItems: "Left" }}> <Link to ={`/infor_store/${store.id_CH}`} className='text-primary'>{store.TenCH}</Link> </Typography>
                                    <Typography  sx={{fontSize: 17, alignItems: "Left"}}>Mô tả:</Typography>
                                    <Typography  sx={{fontSize: 17, alignItems: "Left"}}>{store.MoTa ?  store.MoTa : <><br/></>}</Typography>
                                    <Box sx={{ '& button': { margin: 2} }}>
                                        {
                                            store.TrangThai === 1  ? // 1: Còn món, != 1: Hết món (disabled button )
                                            <>
                                               <Button sx ={{backgroundColor: '#FFB30E'}} variant="contained" size="medium" onClick= {
                                                    async e => {
                                                        try {
                                                            await axios.post("http://localhost:5000/store/add_cart", {
                                                                id_Email: role._id,
                                                                id_MonAn: store._id,
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
                                                                id_MonAn: store._id,
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
                        )}                 
                </Grid>          
                </div>  
            <Footer/> 
            </div>  
        </div>  
    </>
  );
}
