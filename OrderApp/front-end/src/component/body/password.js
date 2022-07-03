import React, { useState } from 'react';
import axios from 'axios';
import Header from '../header'
import Footer from '../footer'
import { useHistory} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { showErrMsg, showSuccessMsg} from '../unitl/notification/notification';
import {FormControl,InputAdornment, Grid, Paper, Button, InputLabel, OutlinedInput, IconButton, Typography} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import {isMatch} from '../unitl/validation/validation'
import LoadingButton from '@mui/lab/LoadingButton';

 
const paperStyle = {padding: 32, height: '55vh', width: 358, margin: "130px auto"}
const btstyle = {margin:'8px 0'}

const initiaiState = {
    MatKhauCu: '',
    MatKhauMoi:'',
    cf_password: '',
    err:'',
    success: '',
}
export default function Password_Ad() {

    const history = useHistory();
    const [loading, setLoading] = useState(false);

    const auth =  useSelector(state => state.auth);
    const token = useSelector(state => state.token);

    const {user} = auth;
    const [data, setData] = useState(initiaiState);
    const {MatKhauCu, MatKhauMoi, cf_password, err, success} = data;

// Hàm show mật khẩu
   const handleClickShowPassword = () => {
    setData({
      ...data,
      showPassword: !data.showPassword,
    });
  };
// Hàm click chuột show
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
      
    
// Hàm xử lý...
    const handleChange = e => {
        const {name, value} = e.target;
        setData({...data, [name]:value, err:'', success: ''});
    }

// Hàm xử lý submit lên server
    const handleSubmit = async e => {
        e.preventDefault()
        setLoading(true)
         if(!isMatch(MatKhauMoi, cf_password)){
            return setData({...data, err: "Mật khẩu xác nhận không khớp.", success: ''}) ;  
         }

         try {
            const res = await axios.patch(`http://localhost:5000/user/change_password/${user._id}`, {MatKhauCu, MatKhauMoi: cf_password},
                {
                     headers: {Authorization: token}
                });
                setTimeout(() => {
                    setData({...data, err:'', success: res.data.msg});
                    setLoading(false);
                }, 500); 
         } catch (err) {
             setTimeout(() => {
                err.response.data.msg && 
                setData({...data, err: err.response.data.msg, success: ''});
                setLoading(false);
             }, 500);         
            }
      }

  return (
    <>
        {/* Page Wrapper */}
        <div id="wrapper">
            {/* End of Sidebar */}
            {/* Content Wrapper */}
            <div id="content-wrapper" className="d-flex flex-column">
                <Header/>
            {/* Main Content */}
            <div id="content">
                {/* Begin Page Content */}
                <div className="container-fluid">
                    {/* Page Heading */}
                    <Grid>
                            <Paper elevation = {10} style = {paperStyle}>
                                <Grid align = 'center'>
                                    <h2>Đổi mật khẩu</h2>
                                </Grid>
                                
                                <FormControl sx={{ m: 1, width: '32ch' }} variant="outlined">
                                        <InputLabel htmlFor="outlined-adornment-password">Mật khẩu cũ</InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-password"
                                            name = 'MatKhauCu'
                                            onChange={handleChange}
                                            type={data.showPassword ? 'text' : 'password'}
                                            endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                                >
                                                {data.showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                            }
                                            label="Mật khẩu cũ"
                                        />
                                </FormControl>

                                    <FormControl sx={{ m: 1, width: '32ch' }} variant="outlined">
                                        <InputLabel htmlFor="outlined-adornment-password">Mật khẩu mới</InputLabel>
                                        <OutlinedInput
                                            id="outlined-password"
                                            name = 'MatKhauMoi'
                                            onChange={handleChange}
                                            type={data.showPassword ? 'text' : 'password'}
                                            endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                                >
                                                {data.showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                            }
                                            label="Mật khẩu mới"
                                        />
                                </FormControl>

                                <FormControl sx={{ m: 1, width: '32ch' }} variant="outlined">
                                        <InputLabel htmlFor="outlined-adornment-password"> Xác nhận mật khẩu</InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-password"
                                            name = "cf_password"
                                            onChange={handleChange}
                                            type={data.showPassword ? 'text' : 'password'}
                                            endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                                >
                                                {data.showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                            }
                                            label="Xác nhận mật khẩu"
                                        />
                                </FormControl>
                                {
                                    loading ? <LoadingButton sx={{width: '38ch', margin:'8px 0' }} loading loadingIndicator="Đang xử lý..." variant="outlined">Fetch data</LoadingButton>
                                            : <Button type = 'submit' color = 'primary' onClick={handleSubmit} sx={{width: '38ch' }} variant='contained' style ={btstyle}> Cập nhật</Button>
                                }       
                                <Typography>{err && showErrMsg(err)} </Typography>
                                <Typography>{success && showSuccessMsg(success)}</Typography>
                            </Paper>
                    </Grid>
                </div>
                {/* /.container-fluid */}
            </div>
            {/* End of Main Content */}
            {/* Footer */}
            <Footer/>
            {/* End of Footer */}
            </div>
            {/* End of Content Wrapper */}
        </div>
        {/* End of Page Wrapper */}
        {/* Scroll to Top Button*/}
        <a className="scroll-to-top rounded" href="#page-top">
            <i className="fas fa-angle-up" />
        </a>
    </>
  );
}
