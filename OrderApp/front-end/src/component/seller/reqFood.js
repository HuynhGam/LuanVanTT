import React, {useEffect, useState} from 'react';
import Sidebar from './sidebar';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux'
import Moment from 'react-moment';
import {Box, Button, Stack, Typography} from '@mui/material';   
import {Link, useHistory} from 'react-router-dom';
import {fetchShipper, dispatchGetShipper} from '../../redux/actions/shipperAction'


export default function ReqOrder() {
  
    const order = useSelector(state => state.order); // Lấy từ react-redux

    const auth = useSelector(state => state.auth); 
    const {isLogged} = auth;

    const shippers = useSelector(state => state.shippers);

    const history = useHistory();
    const token = useSelector(state => state.token);

    const [callback] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if(isLogged){
            return fetchShipper().then(res =>{
                dispatch(dispatchGetShipper(res));
            })
        }
    },[token, isLogged, dispatch, callback])

    // Tìm những đơn hàng có cùng mã id
    const duplicateIds = order.map(v => v.id_DH).filter((v, i, vIds) => vIds.indexOf(v) !== i);
    const oneID = order.filter(obj => !duplicateIds.includes(obj.id_DH));
    const sameID = order.filter(obj => duplicateIds.includes(obj.id_DH));
// Lấy tổng tiền bên sameID

    const newData = [...new Set(sameID.map(d => d.id_DH))].map(id_DH => {
        return {
          id_DH,
          ChiTiet: sameID.filter(d => d.id_DH === id_DH)
        }
      })
      console.log(newData)

      const fee = newData.map(v =>  v.ChiTiet.map( d => d.GiaBan * d.SoLuong).reduce((a,b) => a + b))
  return (
    <>
        <div id="app">
            <div id="sidebar" class="active">
                <Sidebar/>
            </div>

            <div id="main">
             
                <div class="page-content">
                {
                        newData.map(detail => 
                                <>
                                    <Stack sx = {{marginTop: 10, marginLeft: 10}}> 
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
                                            <Typography sx={{fontSize: 20, marginTop: 1}}> {detail.ChiTiet[0].TenCH} </Typography>
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
                                            <Typography sx={{fontSize: 16, marginLeft: 1, maxWidth: 650}}>Giao đến: {detail.ChiTiet[0].DiaChiNhanHang}</Typography> 
                                            <Typography sx={{fontSize: 16, marginLeft: 1, maxWidth: 650}}>Phí ship: {(sameID[0].TongCong - fee).toLocaleString('it-IT', {style : 'currency', currency : 'VND'})} </Typography>                       
                                            <Typography  sx={{fontSize: 22,  marginLeft: 92, marginTop: -2}}>Tổng cộng: {detail.ChiTiet[0].TongCong.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</Typography>                                                                                                                                                                                                     
                                        </Box>
                                        {/* Button */}
                                                    <Box sx={{ '& button': {marginTop:2, marginBlockEnd: 2} }}>
                                                        <>
                                                        <Button sx ={{backgroundColor: '#FFB30E', marginLeft: 79}} variant="contained" size="large" onClick= {
                                                                async e => {
                                                                    try {
                                                                        const _id = shippers.map(id => id._id )
                                                                        var randomID = _id[Math.floor(Math.random()*_id.length)]; 
                                                                        await axios.post(`http://localhost:5000/store/send_req`, {
                                                                            id_Shipper: randomID,
                                                                            id_DH: detail.id_DH
                                                                        });
                                                                        alert('Thao tác thành công')                                  
                                                                    } catch (err) {
                                                                        alert(err)
                                                                    }
                                                                    }
                                                            }>
                                                                Hoàn tất chuẩn bị
                                                            </Button>
                                                        <Button sx ={{backgroundColor: '#FFB30E', marginLeft: 5}} variant="contained" size="large" onClick= {
                                                                async e => {
                                                                    try {
                                                                        await axios.patch(`http://localhost:5000/store/cancel/${detail.id_DH}`);
                                                                        alert('Thao tác thành công')
                                                                        setTimeout(() => {
                                                                            window.location.reload();
                                                                        }, 500);   
                                                                    } catch (err) {
                                                                        alert(err)
                                                                    }
                                                                    }
                                                            }>
                                                                Hủy đơn
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
                                            <Stack sx = {{marginTop: 10, marginLeft: 10}}>                              
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
                                                        <Typography sx={{fontSize: 20, marginTop: 1}}> {detail.EmailDatHang} - Số điện thoại: {detail.SDTDatHang} </Typography>
                                                        <Typography sx={{fontSize: 18, marginTop: 1}}> {detail.TenCH} </Typography>
                                                        <Typography sx={{fontSize: 16, marginLeft: 1}}> Chi tiết: </Typography>
                                                        <Typography sx={{fontSize: 16, marginLeft: 2}}> {detail.TenMonAn} x {detail.SoLuong} </Typography>
                                                        <Typography sx={{fontSize: 16, marginLeft: 2}}> Giá: {detail.GiaBan.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})} </Typography>
                                                        <Typography sx={{fontSize: 16, marginLeft: 2}}> Giao đến: {detail.DiaChiNhanHang} </Typography>
                                                        <Typography sx={{fontSize: 16, marginLeft: 1}}>Phí giao hàng: {(detail.TongCong - (detail.GiaBan * detail.SoLuong)).toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</Typography>
                                                        <Typography  sx={{fontSize: 22,  marginLeft: 92, marginTop: -2}}>Tổng cộng: {detail.TongCong.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</Typography>
                                                    </Box>
 
                                                    <Box sx={{ '& button': {marginTop:2, marginBlockEnd: 2} }}>
                                                        <>
                                                        <Button sx ={{backgroundColor: '#FFB30E', marginLeft: 79}} variant="contained" size="large" onClick= {
                                                                async e => {
                                                                    try {
                                                                        const _id = shippers.map(id => id._id )
                                                                        var randomID = _id[Math.floor(Math.random()*_id.length)]; 
                                                                        await axios.post(`http://localhost:5000/store/send_req`, {
                                                                            id_Shipper: randomID,
                                                                            id_DH: detail.id_DH
                                                                        });
                                                                        alert('Thao tác thành công')                                  
                                                                    } catch (err) {
                                                                        alert(err)
                                                                    }
                                                                    }
                                                            }>
                                                                Hoàn tất chuẩn bị
                                                            </Button>
                                                        <Button sx ={{backgroundColor: '#FFB30E', marginLeft: 5}} variant="contained" size="large" onClick= {
                                                                 async e => {
                                                                     try {
                                                                        await axios.patch(`http://localhost:5000/store/cancel/${detail.id_DH}`);
                                                                        alert('Thao tác thành công')
                                                                         setTimeout(() => {
                                                                             window.location.reload();
                                                                         }, 500);   
                                                                    } catch (err) {
                                                                        alert(err)
                                                                    }
                                                                    }
                                                            }>
                                                                Hủy đơn
                                                             </Button>
                                                         </>                                           
                                                     </Box>
                                                 </Box>
                                  </Stack>
                            </>
                            ))            
                    }  
                </div>
            </div>
        </div>
    </>
  );
}
