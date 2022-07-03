import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useParams, Link} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux'
import Header from '../header'
import Footer from '../footer';
import {fetchProcess, dispatchGetProcess} from '../../redux/actions/orderAction'
import Moment from 'react-moment';
import {Box, Button, Stack, Typography, Grid, Step, Stepper, StepLabel} from '@mui/material';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import LoopIcon from '@mui/icons-material/Loop';

  
  const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    ...(ownerState.active && {
      backgroundImage:
        'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
      boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    }),
    ...(ownerState.completed && {
      backgroundImage:
        'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
    }),
  }));
  
  function ColorlibStepIcon(props) {
    const { active, completed, className } = props;
  
    const icons = {
      1: <LoopIcon/>,
      2: <DeliveryDiningIcon/>,
      3: <CheckCircleIcon />,
    };
  
    return (
      <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
        {icons[String(props.icon)]}
      </ColorlibStepIconRoot>
    );
  }
  
  ColorlibStepIcon.propTypes = {
    /**
     * Whether this step is active.
     * @default false
     */
    active: PropTypes.bool,
    className: PropTypes.string,
    /**
     * Mark the step as completed. Is passed to child components.
     * @default false
     */
    completed: PropTypes.bool,
    /**
     * The label displayed in the step icon.
     */
    icon: PropTypes.node,
  };

export default function ProcessOder() {
    const {email} = useParams();
    const auth = useSelector(state => state.auth); // Lấy từ react-redux
    const order = useSelector(state => state.order); // Lấy từ react-redux
 
    const { isLogged, user, role } = auth; // Lấy từ react-redux
    const id_user = user._id //Lấy id của người dùng

    const [callback] = useState(false);
    const dispatch = useDispatch();

     useEffect(() => {
        if(isLogged === true){
            return fetchProcess(email).then(res =>{
                dispatch(dispatchGetProcess(res));
            })   
            
    }},[email, isLogged, dispatch, callback])

    // Tìm những đơn hàng có cùng mã id
    const duplicateIds = order.map(v => v.id_DH).filter((v, i, vIds) => vIds.indexOf(v) !== i);
    const oneID = order.filter(obj => !duplicateIds.includes(obj.id_DH));
    const sameID = order.filter(obj => duplicateIds.includes(obj.id_DH));

    // Lấy tổng tiền bên sameID
    const fee = sameID.map(v =>  v.GiaBan * v.SoLuong).reduce((acc, curr) => acc + curr,0);

  return (
 <div id="wrapper">  
            <div id="content-wrapper">  
                <Header />
            <div id="content">  
            {
                oneID.length > 0 ? (
                    oneID.slice(0, 1).map(detail => (
                        detail.TrangThai == 1 ?
                        <>
                            <Stepper sx ={{marginTop: 20}} alternativeLabel activeStep={0}>
                                        <Step>
                                            <StepLabel StepIconComponent={ColorlibStepIcon}>Đang xử lý</StepLabel>
                                        </Step>
                                        <Step>
                                            <StepLabel StepIconComponent={ColorlibStepIcon}>Đang giao hàng</StepLabel>
                                        </Step>
                                        <Step>
                                            <StepLabel StepIconComponent={ColorlibStepIcon}>Giao hàng thành công</StepLabel>
                                        </Step>
                            </Stepper>
                            <Stack sx = {{marginTop: 10, marginLeft: 36}}>                              
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
                                            {/* Thông tin đơn hàng                                        */}
                                            <Typography sx={{fontSize: 20, marginTop: 1}}> {detail.TenCH} </Typography>
                                            <Typography sx={{fontSize: 16, marginLeft: 1, maxWidth: 650}}>Địa chỉ: {detail.DiaChi_CH}</Typography>
                                            <Typography sx={{fontSize: 16, marginLeft: 2}}>Chi tiết:</Typography>
                                            <Typography sx={{fontSize: 16, marginLeft: 3}}>{detail.TenMonAn}</Typography>
                                            <Typography sx={{fontSize: 16, marginLeft: 3}}>{detail.GiaBan.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})} x {detail.SoLuong}</Typography>
                                            <Typography sx={{fontSize: 16, marginLeft: 1, maxWidth: 650}}>Giao đến: {detail.DiaChi}</Typography>
                                            <Typography sx={{fontSize: 16, marginLeft: 1, maxWidth: 650}}>Người nhận: {detail.Email} - SDT : {detail.SDTDatHang}</Typography>
                                            {/* Phí vận chuyển */}
                                            <Typography sx={{fontSize: 16, marginLeft: 1}}>Phí giao hàng: {(detail.TongCong - (detail.GiaBan * detail.SoLuong)).toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</Typography>
                                            <Typography sx={{fontSize: 22,  marginLeft: 94, marginTop: -6}}>Tổng cộng: {detail.TongCong.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</Typography>
                                            {/* Button */}
                                            <Box sx={{ '& button': {marginTop:4, marginBlockEnd: 2} }}>
                                                    <>
                                                        <Button sx ={{backgroundColor: '#FFB30E', marginLeft: 73}} variant="contained" size="large" disabled>
                                                                Đã nhận được đơn hàng
                                                        </Button>

                                                        <Button sx ={{backgroundColor: '#FFB30E', marginLeft: 5}} variant="contained" size="large" onClick= {
                                                            async e => {
                                                                try {
                                                                    await axios.patch(`http://localhost:5000/store/cancel/${detail.id_DH}`);
                                                                    alert('Thao tác thành công')
                                                                    setTimeout(() => {
                                                                        window.location.href = `/order/${role.Email}`
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
                                </Box> 
                            </Stack> 
                        </>
                        : detail.TrangThai == 2 ? 
                        <>
                            <Stepper sx ={{marginTop: 20}} alternativeLabel activeStep={1}>
                                        <Step>
                                            <StepLabel StepIconComponent={ColorlibStepIcon}>Đang xử lý</StepLabel>
                                        </Step>
                                        <Step>
                                            <StepLabel StepIconComponent={ColorlibStepIcon}>Đang giao hàng</StepLabel>
                                        </Step>
                                        <Step>
                                            <StepLabel StepIconComponent={ColorlibStepIcon}>Giao hàng thành công</StepLabel>
                                        </Step>
                            </Stepper>
                            <Stack sx = {{marginTop: 10, marginLeft: 36}}>                              
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
                                            {/* Thông tin đơn hàng                                        */}
                                            <Typography sx={{fontSize: 20, marginTop: 1}}> {detail.TenCH} </Typography>
                                            <Typography sx={{fontSize: 16, marginLeft: 1, maxWidth: 650}}>Địa chỉ: {detail.DiaChi_CH}</Typography>
                                            <Typography sx={{fontSize: 16, marginLeft: 2}}>Chi tiết:</Typography>
                                            <Typography sx={{fontSize: 16, marginLeft: 3}}>{detail.TenMonAn}</Typography>
                                            <Typography sx={{fontSize: 16, marginLeft: 3}}>{detail.GiaBan.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})} x {detail.SoLuong}</Typography>
                                            <Typography sx={{fontSize: 16, marginLeft: 1, maxWidth: 650}}>Giao đến: {detail.DiaChi}</Typography>
                                            <Typography sx={{fontSize: 16, marginLeft: 1, maxWidth: 650}}>Người nhận: {detail.Email} - SDT : {detail.SDTDatHang}</Typography>
                                            {/* Phí vận chuyển */}
                                            <Typography sx={{fontSize: 16, marginLeft: 1}}>Phí giao hàng: {(detail.TongCong - (detail.GiaBan * detail.SoLuong)).toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</Typography>
                                            <Typography sx={{fontSize: 22,  marginLeft: 94, marginTop: -6}}>Tổng cộng: {detail.TongCong.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</Typography>
                                            {/* Button */}
                                            <Box sx={{ '& button': {marginTop:4, marginBlockEnd: 2} }}>
                                                    <>
                                                        <Button sx ={{backgroundColor: '#FFB30E', marginLeft: 73}} variant="contained" size="large" disabled>
                                                                Đã nhận được đơn hàng
                                                        </Button>

                                                        <Button sx ={{backgroundColor: '#FFB30E', marginLeft: 5}} variant="contained" size="large" disabled>
                                                            Hủy đơn
                                                        </Button>
                                                    </>                                           
                                            </Box>
                                    </Box>                                                  
                                </Box> 
                            </Stack> 
                        </>
                        : detail.TrangThai == 3 ?
                        <>
                            <Stepper sx ={{marginTop: 20}} alternativeLabel activeStep={2}>
                                        <Step>
                                            <StepLabel StepIconComponent={ColorlibStepIcon}>Đang xử lý</StepLabel>
                                        </Step>
                                        <Step>
                                            <StepLabel StepIconComponent={ColorlibStepIcon}>Đang giao hàng</StepLabel>
                                        </Step>
                                        <Step>
                                            <StepLabel StepIconComponent={ColorlibStepIcon}>Giao hàng thành công</StepLabel>
                                        </Step>
                            </Stepper>
                            <Stack sx = {{marginTop: 10, marginLeft: 36}}>                              
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
                                            {/* Thông tin đơn hàng                                        */}
                                            <Typography sx={{fontSize: 20, marginTop: 1}}> {detail.TenCH} </Typography>
                                            <Typography sx={{fontSize: 16, marginLeft: 1, maxWidth: 650}}>Địa chỉ: {detail.DiaChi_CH}</Typography>
                                            <Typography sx={{fontSize: 16, marginLeft: 2}}>Chi tiết:</Typography>
                                            <Typography sx={{fontSize: 16, marginLeft: 3}}>{detail.TenMonAn}</Typography>
                                            <Typography sx={{fontSize: 16, marginLeft: 3}}>{detail.GiaBan.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})} x {detail.SoLuong}</Typography>
                                            <Typography sx={{fontSize: 16, marginLeft: 1, maxWidth: 650}}>Giao đến: {detail.DiaChi}</Typography>
                                            <Typography sx={{fontSize: 16, marginLeft: 1, maxWidth: 650}}>Người nhận: {detail.Email} - SDT : {detail.SDTDatHang}</Typography>
                                            {/* Phí vận chuyển */}
                                            <Typography sx={{fontSize: 16, marginLeft: 1}}>Phí giao hàng: {(detail.TongCong - (detail.GiaBan * detail.SoLuong)).toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</Typography>
                                            <Typography sx={{fontSize: 22,  marginLeft: 94, marginTop: -6}}>Tổng cộng: {detail.TongCong.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</Typography>
                                            {/* Button */}
                                            <Box sx={{ '& button': {marginTop:4, marginBlockEnd: 2} }}>
                                                    <>
                                                        <Button sx ={{backgroundColor: '#FFB30E', marginLeft: 73}} variant="contained" size="large" onClick = {
                                                            async e => {
                                                                try {
                                                                    await axios.patch(`http://localhost:5000/store/confirm/${detail.id_DH}`);
                                                                    setTimeout(() => {
                                                                        window.location.href = `/order/${role.Email}`
                                                                    }, 500);   
                                                                } catch (err) {
                                                                    alert(err)
                                                                }
                                                                }
                                                        }>
                                                                Đã nhận được đơn hàng
                                                        </Button>

                                                        <Button sx ={{backgroundColor: '#FFB30E', marginLeft: 5}} variant="contained" size="large" disabled>
                                                            Hủy đơn
                                                        </Button>
                                                    </>                                           
                                            </Box>
                                    </Box>                                                  
                                </Box> 
                            </Stack> 
                        </>
                    :
                    <></>
                )) 
                ) : (<><Typography sx={{marginTop:10}}>  </Typography></>)          
            }
            
            {
                    sameID.length > 0 ? (
                        sameID[0].TrangThai == 1 ? (
                         <>
                             <Stepper sx ={{marginTop: 20}} alternativeLabel activeStep={0}>
                                         <Step>
                                             <StepLabel StepIconComponent={ColorlibStepIcon}>Đang xử lý</StepLabel>
                                         </Step>
                                         <Step>
                                             <StepLabel StepIconComponent={ColorlibStepIcon}>Đang giao hàng</StepLabel>
                                         </Step>
                                         <Step>
                                             <StepLabel StepIconComponent={ColorlibStepIcon}>Giao hàng thành công</StepLabel>
                                         </Step>
                             </Stepper>

                             <Stack sx = {{marginTop: 10, marginLeft: 36}}>                              
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
                                        <Typography sx={{fontSize: 14,marginBlockEnd: 1, fontWeight:600}}> Mã đơn hàng: {sameID[0].id_DH} - Ngày đặt: <Moment format="DD/MM/YYYY">{sameID[0].NgayDat}</Moment></Typography>
                                        {   /* Trạng thái đơn hàng  */
                                            sameID[0].TrangThai == 2 ? 
                                                    <Typography sx={{fontSize: 14, marginTop:-3, marginLeft: 108}}>Đang giao hàng</Typography>
                                                : sameID[0].TrangThai == 1 ?
                                                    <Typography sx={{fontSize: 14, marginTop:-3, marginLeft: 108}}>Đang xử lý...</Typography>
                                                : sameID[0].TrangThai == 3 ? 
                                                    <Typography sx={{fontSize: 14, marginTop:-3, marginLeft: 108}}>Đã hoàn thành</Typography>
                                                : 
                                                    <Typography sx={{fontSize: 14, marginTop:-3, marginLeft: 108}}>Đã hủy</Typography>
                                        }           
                                    {/* Thông tin đơn hàng*/}
                                        {
                                            sameID.slice(0,5).map(detail => 
                                              <>
                                                <Typography sx={{fontSize: 20, marginTop: 1}}> {detail.TenCH} </Typography>
                                                <Typography sx={{fontSize: 16, marginLeft: 1, maxWidth: 650}}>Địa chỉ: {detail.DiaChi_CH}</Typography>
                                                <Typography sx={{fontSize: 16, marginLeft: 2}}>Chi tiết:</Typography>
                                                <Typography sx={{fontSize: 16, marginLeft: 3}}>{detail.TenMonAn}</Typography>
                                                <Typography sx={{fontSize: 16, marginLeft: 3}}>{detail.GiaBan.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})} x {detail.SoLuong}</Typography>
                                                <Typography sx={{fontSize: 16, marginLeft: 1, maxWidth: 650}}>Giao đến: {detail.DiaChi}</Typography>
                                              </>
                                            )
                                        }
                                    {/* Phí vận chuyển */}
                                         <Typography sx={{fontSize: 16, marginLeft: 1, maxWidth: 650}}>Người nhận: {sameID[0].Email} - SDT : {sameID[0].SDTDatHang}</Typography>
                                         <Typography  sx={{fontSize: 16,  marginLeft: 1, maxWidth: 650}}>Giao đến: {sameID[0].DiaChi}</Typography>
                                         <Typography  sx={{fontSize: 16,  marginLeft: 1}}>Phí giao hàng: {(sameID[0].TongCong - fee).toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</Typography>
                                         <Typography  sx={{fontSize: 22,  marginLeft: 92, marginTop: -6}}>Tổng cộng: {sameID[0].TongCong.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</Typography>
                                            {/* Button */}
                                            <Box sx={{ '& button': {marginTop:2, marginBlockEnd: 2} }}>
                                                    <>
                                                        <Button sx ={{backgroundColor: '#FFB30E', marginLeft: 73}} variant="contained" size="large" disabled>
                                                                Đã nhận được đơn hàng
                                                        </Button>

                                                        <Button sx ={{backgroundColor: '#FFB30E', marginLeft: 3}} variant="contained" size="large" onClick= {
                                                                async e => {
                                                                    try {
                                                                        await axios.patch(`http://localhost:5000/store/cancel/${sameID[0].id_DH}`);
                                                                        alert('Thao tác thành công')
                                                                        setTimeout(() => {
                                                                            window.location.href = `/order/${role.Email}`
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
                                </Box> 
                            </Stack> 
                         </>
                        ) 
                        : sameID[0].TrangThai == 2 ? (
                         <>
                             <Stepper sx ={{marginTop: 20}} alternativeLabel activeStep={1}>
                                         <Step>
                                             <StepLabel StepIconComponent={ColorlibStepIcon}>Đang xử lý</StepLabel>
                                         </Step>
                                         <Step>
                                             <StepLabel StepIconComponent={ColorlibStepIcon}>Đang giao hàng</StepLabel>
                                         </Step>
                                         <Step>
                                             <StepLabel StepIconComponent={ColorlibStepIcon}>Giao hàng thành công</StepLabel>
                                         </Step>
                             </Stepper>

                             <Stack sx = {{marginTop: 10, marginLeft: 36}}>                              
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
                                        <Typography sx={{fontSize: 14,marginBlockEnd: 1, fontWeight:600}}> Mã đơn hàng: {sameID[0].id_DH} - Ngày đặt: <Moment format="DD/MM/YYYY">{sameID[0].NgayDat}</Moment></Typography>
                                        {   /* Trạng thái đơn hàng  */
                                            sameID[0].TrangThai == 2 ? 
                                                    <Typography sx={{fontSize: 14, marginTop:-3, marginLeft: 108}}>Đang giao hàng</Typography>
                                                : sameID[0].TrangThai == 1 ?
                                                    <Typography sx={{fontSize: 14, marginTop:-3, marginLeft: 108}}>Đang xử lý...</Typography>
                                                : sameID[0].TrangThai == 3 ? 
                                                    <Typography sx={{fontSize: 14, marginTop:-3, marginLeft: 108}}>Đã hoàn thành</Typography>
                                                : 
                                                    <Typography sx={{fontSize: 14, marginTop:-3, marginLeft: 108}}>Đã hủy</Typography>
                                        }           
                                    {/* Thông tin đơn hàng*/}
                                        {
                                            sameID.slice(0,5).map(detail => 
                                              <>
                                                <Typography sx={{fontSize: 20, marginTop: 1}}> {detail.TenCH} </Typography>
                                                <Typography sx={{fontSize: 16, marginLeft: 1, maxWidth: 650}}>Địa chỉ: {detail.DiaChi_CH}</Typography>
                                                <Typography sx={{fontSize: 16, marginLeft: 2}}>Chi tiết:</Typography>
                                                <Typography sx={{fontSize: 16, marginLeft: 3}}>{detail.TenMonAn}</Typography>
                                                <Typography sx={{fontSize: 16, marginLeft: 3}}>{detail.GiaBan.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})} x {detail.SoLuong}</Typography>
                                              </>
                                            )
                                        }
                                    {/* Phí vận chuyển */}
                                         <Typography  sx={{fontSize: 16,  marginLeft: 1, maxWidth: 650}}>Giao đến: {sameID[0].DiaChi}</Typography>
                                         <Typography  sx={{fontSize: 16,  marginLeft: 1}}>Phí giao hàng: {(sameID[0].TongCong - fee).toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</Typography>
                                         <Typography  sx={{fontSize: 22,  marginLeft: 92, marginTop: -6}}>Tổng cộng: {sameID[0].TongCong.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</Typography>
                                            {/* Button */}
                                            <Box sx={{ '& button': {marginTop:2, marginBlockEnd: 2} }}>
                                                    <>
                                                        <Button sx ={{backgroundColor: '#FFB30E', marginLeft: 73}} variant="contained" size="large" disabled>
                                                                Đã nhận được đơn hàng
                                                        </Button>

                                                        <Button sx ={{backgroundColor: '#FFB30E', marginLeft: 3}} variant="contained" size="large" disabled>
                                                                Hủy đơn
                                                        </Button>
                                                    </>                                           
                                            </Box>
                                    </Box>                                                  
                                </Box> 
                            </Stack> 
                         </>
                         )
                        : sameID[0].TrangThai == 3 ? (
                            <>
                                <Stepper sx ={{marginTop: 20}} alternativeLabel activeStep={2}>
                                            <Step>
                                                <StepLabel StepIconComponent={ColorlibStepIcon}>Đang xử lý</StepLabel>
                                            </Step>
                                            <Step>
                                                <StepLabel StepIconComponent={ColorlibStepIcon}>Đang giao hàng</StepLabel>
                                            </Step>
                                            <Step>
                                                <StepLabel StepIconComponent={ColorlibStepIcon}>Giao hàng thành công</StepLabel>
                                            </Step>
                                </Stepper>

                                <Stack sx = {{marginTop: 10, marginLeft: 36}}>                              
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
                                            <Typography sx={{fontSize: 14,marginBlockEnd: 1, fontWeight:600}}> Mã đơn hàng: {sameID[0].id_DH} - Ngày đặt: <Moment format="DD/MM/YYYY">{sameID[0].NgayDat}</Moment></Typography>
                                            {   /* Trạng thái đơn hàng  */
                                                sameID[0].TrangThai == 2 ? 
                                                        <Typography sx={{fontSize: 14, marginTop:-3, marginLeft: 108}}>Đang giao hàng</Typography>
                                                    : sameID[0].TrangThai == 1 ?
                                                        <Typography sx={{fontSize: 14, marginTop:-3, marginLeft: 108}}>Đang xử lý...</Typography>
                                                    : sameID[0].TrangThai == 3 ? 
                                                        <Typography sx={{fontSize: 14, marginTop:-3, marginLeft: 108}}>Đã hoàn thành</Typography>
                                                    : 
                                                        <Typography sx={{fontSize: 14, marginTop:-3, marginLeft: 108}}>Đã hủy</Typography>
                                            }           
                                        {/* Thông tin đơn hàng*/}
                                            {
                                                sameID.slice(0,5).map(detail => 
                                                <>
                                                    <Typography sx={{fontSize: 20, marginTop: 1}}> {detail.TenCH} </Typography>
                                                    <Typography sx={{fontSize: 16, marginLeft: 1, maxWidth: 650}}>Địa chỉ: {detail.DiaChi_CH}</Typography>
                                                    <Typography sx={{fontSize: 16, marginLeft: 2}}>Chi tiết:</Typography>
                                                    <Typography sx={{fontSize: 16, marginLeft: 3}}>{detail.TenMonAn}</Typography>
                                                    <Typography sx={{fontSize: 16, marginLeft: 3}}>{detail.GiaBan.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})} x {detail.SoLuong}</Typography>
                                                </>
                                                )
                                            }
                                        {/* Phí vận chuyển */}
                                            <Typography  sx={{fontSize: 16,  marginLeft: 1, maxWidth: 650}}>Giao đến: {sameID[0].DiaChi}</Typography>
                                            <Typography  sx={{fontSize: 16,  marginLeft: 1}}>Phí giao hàng: {(sameID[0].TongCong - fee).toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</Typography>
                                            <Typography  sx={{fontSize: 22,  marginLeft: 92, marginTop: -6}}>Tổng cộng: {sameID[0].TongCong.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</Typography>
                                                {/* Button */}
                                                <Box sx={{ '& button': {marginTop:2, marginBlockEnd: 2} }}>
                                                        <>
                                                            <Button sx ={{backgroundColor: '#FFB30E', marginLeft: 73}} variant="contained" size="large" onClick = {
                                                            async e => {
                                                                try {
                                                                    await axios.patch(`http://localhost:5000/store/confirm/${sameID[0].id_DH}`);
                                                                    setTimeout(() => {
                                                                        window.location.href = `/order/${role.Email}`
                                                                    }, 500);   
                                                                } catch (err) {
                                                                    alert(err)
                                                                }
                                                                }
                                                        }>
                                                                    Đã nhận được đơn hàng
                                                            </Button>

                                                            <Button sx ={{backgroundColor: '#FFB30E', marginLeft: 3}} variant="contained" size="large" disabled>
                                                                    Hủy đơn
                                                            </Button>
                                                        </>                                           
                                                </Box>
                                        </Box>                                                  
                                    </Box> 
                                </Stack> 
                            </>
                         )
                        : <></>           
                    )
                    :  <><Typography sx={{marginTop:10}}>  </Typography></>
            }

            <Footer/> 
            </div>  
        </div>  
    </div>
  );
}
