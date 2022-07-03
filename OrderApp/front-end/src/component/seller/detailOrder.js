import React, {useEffect, useState} from 'react';
import { useHistory, useParams, Link } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux'
import Sidebar from '../seller/sidebar'
import {Grid, Box, Typography,Stack} from '@mui/material';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {fetchOrStore, dispatchGetOrStore} from '../../redux/actions/orderSucces';
import {fetchCannel, dispatchGetCannel} from '../../redux/actions/orderCannel';
import Moment from 'react-moment';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }



export default function DetailOrder() {
      // TabPanel
    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
      };
      // TabPanel

 
    const {id} = useParams();

    const auth = useSelector(state => state.auth);
    const order_succ = useSelector(state => state.order_succ);
    const order_cannel = useSelector(state => state.order_cannel)

    const {isSeller} = auth
  

    const [callback] = useState(false);
    const dispatch = useDispatch();

 // Lấy tất cả menu qua bên redux
 useEffect(() => {
    if(isSeller){
        return fetchCannel(id).then(res =>{
            dispatch(dispatchGetCannel(res));
        })
    }
},[id, isSeller, dispatch, callback])

// Lấy tất cả menu qua bên redux
    useEffect(() => {
        if(isSeller){
            return fetchOrStore(id).then(res =>{
                dispatch(dispatchGetOrStore(res));
            })
        }
    },[id, isSeller, dispatch, callback])

   


    // Tìm những đơn hàng có cùng mã id
    const duplicateIds = order_succ.map(v => v.id_DH).filter((v, i, vIds) => vIds.indexOf(v) !== i);
    const oneID = order_succ.filter(obj => !duplicateIds.includes(obj.id_DH));
    const sameID = order_succ.filter(obj => duplicateIds.includes(obj.id_DH));
    const oneCannel = order_cannel.filter(obj => !duplicateIds.includes(obj.id_DH));
    const sameCannel = order_cannel.filter(obj => duplicateIds.includes(obj.id_DH));
// Lấy thông tin bên sameID
    const newData = [...new Set(sameID.map(d => d.id_DH))].map(id_DH => {
        return {
          id_DH,
          ChiTiet: sameID.filter(d => d.id_DH === id_DH)
        }
      })
      const newData2 = [...new Set(sameCannel.map(d => d.id_DH))].map(id_DH => {
        return {
          id_DH,
          ChiTiet: sameID.filter(d => d.id_DH === id_DH)
        }
      })

      // Tính tổng tiền bên sameID
      const fee = newData.map(v =>  v.ChiTiet.map( d => d.GiaBan * d.SoLuong).reduce((a,b) => a + b))

  return (  
    <>
        <div id="app">
            <div id="sidebar" class="active">
                <Sidebar/>
            </div>

            <div id="main">     
                <div class="page-content">
                    <Box sx={{ marginTop:3, width: '100%' }}>
                            <Box sx={{ borderBottom: 1, borderColor: '#FFB30E' }}>
                            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered>
                                <Tab label= {`Giao thành công (${order_succ.length})`} {...a11yProps(0)} />
                                <Tab label= {`Đã hủy (${order_cannel.length})`} {...a11yProps(2)} />
                            </Tabs>
                            </Box>
                    </Box>
                        <TabPanel value={value} index={0}>
                            <Grid container spacing={1} sx = {{marginLeft:13, marginTop:1}}>
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
                                                                    {
                                                                        detail.ChiTiet.map(item => (
                                                                            <>
                                                                                <Typography sx={{fontSize: 20, marginTop: 1}}> {item.TenMonAn}</Typography>
                                                                                <Typography sx={{fontSize: 18, marginLeft: 2}}>Số lượng: {item.SoLuong}</Typography>
                                                                                <Typography sx={{fontSize: 18, marginLeft: 2}}>Giá: {(item.GiaBan*item.SoLuong).toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</Typography>
                                                                            </>
                                                                        ))
                                                                    }
                                                                    <Typography sx={{fontSize: 16, marginLeft: 2, maxWidth: 500}}>Giao đến: {detail.ChiTiet[0].DiaChi_NH}</Typography>
                                                                    <Typography sx={{fontSize: 22,  marginLeft: 88, marginTop: 1}}>Tổng cộng: {fee.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</Typography>                                                      
                                                                </Box> 
                                                            </Box>
                                                            </Stack> 
                                                        </>
                                            )     
                                        }  

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
                                                            width: 905,
                                                            height: 230,
                                                            marginBlockEnd:'60px',
                                                        }}
                                                    >
                                                        <Box sx = {{marginLeft:2}}>
                                                            <Typography sx={{fontSize: 14,marginBlockEnd: 1, fontWeight:600}}>Ngày đặt: <Moment format="DD/MM/YYYY">{detail.NgayDat}</Moment> - Mã đơn hàng: {detail.id_DH} </Typography>         
                                                                <Typography sx={{fontSize: 20, marginTop: 1}}> {detail.TenMonAn}</Typography>
                                                                <Typography sx={{fontSize: 18, marginLeft: 2}}>Số lượng: {detail.SoLuong}</Typography>
                                                                <Typography sx={{fontSize: 18, marginLeft: 2}}>Giá: {(detail.GiaBan * detail.SoLuong) .toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</Typography>
                                                                <Typography sx={{fontSize: 16, marginLeft: 2, maxWidth: 500}}>Giao đến: {detail.DiaChi_NH}</Typography>
                                                                <Typography sx={{fontSize: 22,  marginLeft: 74, marginTop: 3}}>Tổng cộng: {(detail.GiaBan * detail.SoLuong).toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</Typography>                                                      
                                                        </Box>                                                  
                                                    </Box> 
                                                </Stack> 
                                            </>
                                            ))            
                                        }     
                            </Grid> 
                        </TabPanel>
                        
                        <TabPanel value={value} index={1}>

                            <Grid container spacing={1} sx = {{marginLeft:13, marginTop:1}}>
                                 {/* Cùng id đơn hàng */}
                                        {
                                            newData2.map(detail => 
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
                                                                <Typography sx={{fontSize: 14,marginBlockEnd: 1, fontWeight:600}}>Ngày hủy: <Moment format="DD/MM/YYYY">{detail.ChiTiet[0].NgayDat}</Moment> - Mã đơn hàng: {detail.id_DH}</Typography> 
                                                                    {
                                                                        detail.ChiTiet.map(item => (
                                                                            <>
                                                                                <Typography sx={{fontSize: 20, marginTop: 1}}> {item.TenMonAn}</Typography>
                                                                                <Typography sx={{fontSize: 18, marginLeft: 2}}>Số lượng: {item.SoLuong}</Typography>
                                                                                <Typography sx={{fontSize: 18, marginLeft: 2}}>Giá: {item.GiaBan.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</Typography>
                                                                            </>
                                                                        ))
                                                                    }
                                                                    <Typography sx={{fontSize: 16, marginLeft: 2, maxWidth: 500}}>Giao đến: {detail.ChiTiet[0].DiaChi_NH}</Typography>
                                                                    <Typography sx={{fontSize: 22,  marginLeft: 88, marginTop: 1}}>Tổng cộng: {fee.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</Typography>                                                      
                                                                </Box> 
                                                            </Box>
                                                            </Stack> 
                                                        </>
                                            )     
                                        }  

                                        {  
                                            oneCannel.map(detail => (
                                            <>
                                                            {/* css */}
                                                <Stack sx = {{marginLeft: 3}}>
                                                    <Box
                                                        sx={{
                                                            bgcolor: 'background.paper',
                                                            boxShadow: 2,
                                                            borderRadius: 4,
                                                            p: 1,
                                                            width: 905,
                                                            height: 230,
                                                            marginBlockEnd:'60px',
                                                        }}
                                                    >
                                                        <Box sx = {{marginLeft:2}}>
                                                            <Typography sx={{fontSize: 14,marginBlockEnd: 1, fontWeight:600}}>Ngày hủy: <Moment format="DD/MM/YYYY">{detail.NgayDat}</Moment> - Mã đơn hàng: {detail.id_DH} </Typography>         
                                                                <Typography sx={{fontSize: 20, marginTop: 1}}> {detail.TenMonAn}</Typography>
                                                                <Typography sx={{fontSize: 18, marginLeft: 2}}>Số lượng: {detail.SoLuong}</Typography>
                                                                <Typography sx={{fontSize: 18, marginLeft: 2}}>Giá: {detail.GiaBan.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</Typography>
                                                                <Typography sx={{fontSize: 16, marginLeft: 2, maxWidth: 500}}>Giao đến: {detail.DiaChi_NH}</Typography>
                                                                <Typography sx={{fontSize: 22,  marginLeft: 74, marginTop: 3}}>Tổng cộng: {(detail.GiaBan * detail.SoLuong).toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</Typography>                                                      
                                                        </Box>                                                  
                                                    </Box> 
                                                </Stack> 
                                            </>
                                            ))            
                                        }     
                            </Grid>
                        </TabPanel>          
                </div>
            </div>
        </div>
    </>
  );
}
