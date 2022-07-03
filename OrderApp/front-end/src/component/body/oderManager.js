import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useParams, Link, useHistory} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux'
import Header from '../header'
import Footer from '../footer';
import {Box, Button, Stack, Typography, Paper, Grid} from '@mui/material';
import {fetchOrder, dispatchGetOrder} from '../../redux/actions/orderAction'
import Moment from 'react-moment';

export default function OderManager() {
    const {email} = useParams();
    const history = useHistory();
    const auth = useSelector(state => state.auth); // Lấy từ react-redux
    const order = useSelector(state => state.order); // Lấy từ react-redux
 
    const { isLogged, user, role } = auth; // Lấy từ react-redux

    const [callback] = useState(false);
    const dispatch = useDispatch();

     useEffect(() => {
        if(isLogged === true){
            return fetchOrder(email).then(res =>{
                dispatch(dispatchGetOrder(res));
            })   
            
    }},[email, isLogged, dispatch, callback])

// Tìm những đơn hàng có cùng mã id
    const duplicateIds = order.map(v => v.id_DH).filter((v, i, vIds) => vIds.indexOf(v) !== i);
    const oneID = order.filter(obj => !duplicateIds.includes(obj.id_DH));
    const sameID = order.filter(obj => duplicateIds.includes(obj.id_DH));

// Lấy thông tin bên sameID
    const newData = [...new Set(sameID.map(d => d.id_DH))].map(id_DH => {
        return {
          id_DH,
          ChiTiet: sameID.filter(d => d.id_DH === id_DH)
        }
      })
// Tính tổng tiền bên sameID
      const fee = newData.map(v =>  v.ChiTiet.map( d => d.GiaBan * d.SoLuong).reduce((a,b) => a + b))

    return (
    <>
        <div id="wrapper">  
            <div id="content-wrapper">  
                <Header />
            <div id="content">  
                <Typography variant="h4" sx={{marginLeft: 6, marginTop:12, marginBlockEnd:4}}>Lịch sử đơn hàng của bạn</Typography>
                <Grid container spacing={1} sx = {{marginLeft:29, marginTop:1}}> 
        {/* Cùng id đơn hàng */}
                    {
                        newData.map(detail => 
                                <>
                                    <Stack sx = {{marginLeft: 3}}>
                                        <Box
                                            sx={{
                                                bgcolor: 'background.paper',
                                                boxShadow: 2,
                                                borderRadius: 4,
                                                p: 1,
                                                width: 1050,
                                                marginBlockEnd:'60px',            
                                            }}
                                        >    
                                            <Box sx = {{marginLeft:2}}>
                                            <Typography sx={{fontSize: 14,marginBlockEnd: 1, fontWeight:600}}> Mã đơn hàng: {detail.id_DH} - Ngày đặt: <Moment format="DD/MM/YYYY">{detail.ChiTiet[0].NgayDat}</Moment></Typography>
                                            {   /* Trạng thái đơn hàng  */
                                                detail.ChiTiet[0].TrangThai == 2 ? 
                                                    <Typography sx={{fontSize: 14, marginTop:-3, marginLeft: 110}}>Đang giao hàng</Typography>
                                                :  detail.ChiTiet[0].TrangThai == 1 ?
                                                    <Typography sx={{fontSize: 14, marginTop:-3, marginLeft: 110}}>Đang xử lý...</Typography>
                                                :  detail.ChiTiet[0].TrangThai == 4 ? 
                                                    <Typography sx={{fontSize: 14, marginTop:-3, marginLeft: 110}}>Đã hoàn thành</Typography>
                                                : 
                                                    <Typography sx={{fontSize: 14, marginTop:-3, marginLeft: 115}}>Đã hủy</Typography>
                                            }   
                                            <Typography sx={{fontSize: 20, marginTop: 1}}> {detail.ChiTiet[0].TenCH} </Typography>
                                            <Typography sx={{fontSize: 16, marginLeft: 1, maxWidth: 650}}>Từ: {detail.ChiTiet[0].DiaChi} </Typography>  
                                            <Typography sx={{fontSize: 16, marginLeft: 1, maxWidth: 650}}>Đến: {detail.ChiTiet[0].DiaChi}</Typography> 
                                            <Typography sx={{fontSize: 16, marginLeft: 2}}>Chi tiết:</Typography>      
                                            {
                                                detail.ChiTiet.map(d =>
                                                    <>
                                                        <Typography sx={{fontSize: 16, marginLeft: 3}}>{d.TenMonAn}</Typography>
                                                        <Typography sx={{fontSize: 16, marginLeft: 3}}>{d.GiaBan.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})} x {d.SoLuong}</Typography>
                                                    </>
                                                )
                                            }
                                             {/* Phí vận chuyển */}
                                             <Typography sx={{fontSize: 16, marginLeft: 1, maxWidth: 650}}>Thành tiền: {(sameID[0].ThanhToan).toLocaleString('it-IT', {style : 'currency', currency : 'VND'})} </Typography>   
                                            <Typography sx={{fontSize: 16, marginLeft: 1, maxWidth: 650}}>Phí ship: {(sameID[0].PhiShip).toLocaleString('it-IT', {style : 'currency', currency : 'VND'})} </Typography>    
                                            <Typography sx={{fontSize: 22,  marginLeft: 94, marginTop: -6}}>Tổng cộng: {sameID[0].TongCong.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</Typography>                                                                                                                                                                                                                       
                                            </Box>
                                        {/* Button */}
                                            <Box sx={{ '& button': {marginTop:2, marginBlockEnd: 2} }}>
                                                <>
                                                    <Button sx ={{backgroundColor: '#FFB30E', marginLeft: 90}} variant="contained" size="large" onClick= {
                                                            async e => {
                                                                try {
                                                                    for(var i =0; i< sameID.length; i++)
                                                                    {
                                                                        await axios.post("http://localhost:5000/store/add_cart", {
                                                                            id_Email: role._id,
                                                                            id_MonAn: sameID[i].id_MonAn,
                                                                            SoLuong: 1                                                         
                                                                        });
                                                                    }        
                                                                        alert('Thao tác thành công')
                                                                        // setTimeout(() => {
                                                                        //     window.location.href = `/cart/${role._id}`
                                                                        // }, 500); 
                                                                    } catch (err) {
                                                                        alert(err)
                                                                    }
                                                                }
                                                        }>
                                                                Đặt món lại
                                                    </Button>

                                                    <Button sx ={{backgroundColor: '#FFB30E', marginLeft: 3}} variant="contained" size="large" onClick={() => (history.push(`/infor_store/${detail.ChiTiet[0].id_CH}`))} >
                                                                Đánh giá
                                                    </Button>
                                                        </>                                           
                                                </Box>                                     
                                            </Box> 
                                        </Stack> 
                                </>
                        )     
                    }       
        {/* Chỉ duy nhất id đơn hàng */}
                    {  
                            oneID.map(detail => (
                            <>
                                            {/* css */}
                                <Stack sx = {{marginLeft: 3}}>
                                    <Box
                                        sx={{
                                            bgcolor: 'background.paper',
                                            boxShadow: 2,
                                            borderRadius: 4,
                                            p: 1,
                                            width: 1050,
                                            marginBlockEnd:'60px',
                                        }}
                                    >
                                        <Box sx = {{marginLeft:2}}>
                                            <Typography sx={{fontSize: 14,marginBlockEnd: 1, fontWeight:600}}> Mã đơn hàng: {detail.id_DH} - Ngày đặt: <Moment format="DD/MM/YYYY">{detail.NgayDat}</Moment></Typography>
                                            {   /* Trạng thái đơn hàng  */
                                                detail.TrangThai == 2 ? 
                                                        <Typography sx={{fontSize: 14, marginTop:-3, marginLeft: 108}}>Đang giao hàng</Typography>
                                                    : detail.TrangThai == 1 ?
                                                        <Typography sx={{fontSize: 14, marginTop:-3, marginLeft: 108}}>Đang xử lý...</Typography>
                                                    : detail.TrangThai == 4 ? 
                                                        <Typography sx={{fontSize: 14, marginTop:-3, marginLeft: 108}}>Đã hoàn thành</Typography>
                                                    : 
                                                        <Typography sx={{fontSize: 14, marginTop:-3, marginLeft: 115}}>Đã hủy</Typography>
                                            }           
                                                {/* Thông tin đơn hàng                                        */}
                                                <Typography sx={{fontSize: 20, marginTop: 1}}> {detail.TenCH} </Typography>
                                                <Typography sx={{fontSize: 16, marginLeft: 1, maxWidth: 650}}>Từ: {detail.DiaChi_CH}</Typography>
                                                <Typography sx={{fontSize: 16, marginLeft: 1, maxWidth: 650}}>Đến: {detail.DiaChi}</Typography>
                                                <Typography sx={{fontSize: 16, marginLeft: 2}}>Chi tiết:</Typography>
                                                <Typography sx={{fontSize: 16, marginLeft: 3}}>{detail.TenMonAn}</Typography>
                                                <Typography sx={{fontSize: 16, marginLeft: 3}}>{detail.GiaBan.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})} x {detail.SoLuong}</Typography>
                                                {/* Phí vận chuyển */}
                                                <Typography sx={{fontSize: 16, marginLeft: 1}}>Thành tiền: {detail.ThanhToan.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</Typography>
                                                <Typography sx={{fontSize: 16, marginLeft: 1}}>Phí giao hàng: {detail.PhiShip.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</Typography>                                
                                                <Typography sx={{fontSize: 22,  marginLeft: 94, marginTop: -6}}>Tổng cộng: {detail.TongCong.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</Typography>
                                                {/* Button */}
                                                <Box sx={{ '& button': {marginTop:2, marginBlockEnd: 2} }}>
                                                        <>
                                                            <Button sx ={{backgroundColor: '#FFB30E',  marginLeft: 88}} variant="contained" size="large" onClick= {
                                                                async e => {
                                                                    try {
                                                                        await axios.post("http://localhost:5000/store/add_cart", {
                                                                            id_Email: role._id,
                                                                            id_MonAn: detail.id_MonAn,
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
                                                                Đặt món lại
                                                            </Button>

                                                            <Button sx ={{backgroundColor: '#FFB30E', marginLeft: 3}} variant="contained" size="large" onClick={() => (history.push(`/infor_store/${detail.id_CH}`))} >
                                                                Đánh giá
                                                            </Button>
                                                        </>                                           
                                                </Box>
                                        </Box>                                                  
                                    </Box> 
                                </Stack> 
                            </>
                            ))            
                    }         
                </Grid>          
                </div>  
            <Footer/> 
            </div>  
        </div>  
    </>
  );
}
