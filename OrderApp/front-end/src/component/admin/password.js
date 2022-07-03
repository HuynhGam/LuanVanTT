import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { showErrMsg, showSuccessMsg} from '../../component/unitl/notification/notification';
import {FormControl,InputAdornment, Grid, Paper, Button, InputLabel, OutlinedInput, IconButton, Typography} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import Sidebar from './sidebar';
import Sidebar_SL from '../seller/sidebar';
import LoadingButton from '@mui/lab/LoadingButton';


const paperStyle = {padding: 32, height: '55vh', width: 380, margin: "100px auto"}
const btstyle = {margin:'8px 0'}

export default function Password_Ad() {
    const auth =  useSelector(state => state.auth);
    const token = useSelector(state => state.token);

    const {isAdmin} = auth;
    const {role} = auth;

    const [loading, setLoading] = useState(false);
    const [values, setValues] = React.useState({
        showPassword: false,
      });

    // Hàm show mật khẩu
    const handleClickShowPassword = () => {
        setValues({
        ...values,
        showPassword: !values.showPassword,
        });
    };
    // Hàm click chuột show
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
        

    const initiaiState = {
        MatKhauMoi: '',
        MatKhauCu: '',
        cf_MatKhau: '',
        err: '',
        success: ''
    };
    const [data, setData] = useState(initiaiState);

    const handleChange = e => {
        const {name, value} = e.target;
        setData({...data, [name]:value, err:'', success:''});

      };

      const {MatKhauCu, MatKhauMoi, cf_MatKhau, err, success} = data;

      const handleSubmit = async e => {
        e.preventDefault(); 
        setLoading(true)
            try {
                const res = await axios.patch(`http://localhost:5000/user/change_password/${role._id}`, {
                    MatKhauCu, 
                    MatKhauMoi: cf_MatKhau},
                {
                    headers: {Authorization: token}
                })
                setTimeout(() => {
                    setData({...data, err:'', success: res.data.msg});
                    setLoading(false) 
                }, 500);
                    
                } catch (err) { 
                    setTimeout(() => {
                        err.response.data.msg && 
                        setData({...data, err: err.response.data.msg, success: ''});
                        setLoading(false) 
                    }, 500);    
                                
                }       
      }

  return (
    <>
    {
        isAdmin ? (
        <div id="app">
            <div id="sidebar" class="active">
                <Sidebar/>
            </div>

            <div id="main">     
                <div class="page-content">
                    <Grid>
                            <Paper elevation = {10} style = {paperStyle}>
                                <Grid align = 'center'>
                                    <h2>Đổi mật khẩu</h2>
                                </Grid>
                                
                                <FormControl sx={{ m: 1, width: '35ch' }} variant="outlined">
                                        <InputLabel htmlFor="outlined-adornment-password">Mật khẩu cũ</InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-password"
                                            name = 'MatKhauCu'
                                            onChange={handleChange}
                                            type={values.showPassword ? 'text' : 'password'}
                                            endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                                >
                                                {values.showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                            }
                                            label="Mật khẩu cũ"
                                        />
                                </FormControl>

                                <FormControl sx={{ m: 1, width: '35ch' }} variant="outlined">
                                        <InputLabel htmlFor="outlined-adornment-password">Mật khẩu mới</InputLabel>
                                        <OutlinedInput
                                            id="outlined-password"
                                            name = 'MatKhauMoi'
                                            onChange={handleChange}
                                            type={values.showPassword ? 'text' : 'password'}
                                            endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                                >
                                                {values.showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                            }
                                            label="Mật khẩu mới"
                                        />
                                </FormControl>

                                <FormControl sx={{ m: 1, width: '35ch' }} variant="outlined">
                                        <InputLabel htmlFor="outlined-adornment-password"> Xác nhận mật khẩu</InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-password"
                                            name = "cf_MatKhau"
                                            onChange={handleChange}
                                            type={values.showPassword ? 'text' : 'password'}
                                            endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                                >
                                                {values.showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                            }
                                            label="Xác nhận mật khẩu"
                                        />
                                </FormControl>
                                {
                                    loading ? <LoadingButton sx={{width: '41ch' }} loading loadingIndicator="Đang xử lý..." variant="outlined">Fetch data</LoadingButton>
                                            : <Button type = 'submit' color = 'primary' onClick={handleSubmit} sx={{width: '41ch' }} variant='contained' style ={btstyle}> Cập nhật</Button>
                                }       
                                <Typography>{err && showErrMsg(err)} </Typography>
                                <Typography>{success && showSuccessMsg(success)}</Typography>
                            </Paper>
                    </Grid>
                </div>
            </div>
        </div>
        ) : (
            <div id="app">
            <div id="sidebar" class="active">
                <Sidebar_SL/>
            </div>

            <div id="main">     
                <div class="page-content">
                    <Grid>
                            <Paper elevation = {10} style = {paperStyle}>
                                <Grid align = 'center'>
                                    <h2>Đổi mật khẩu</h2>
                                </Grid>
                                
                                <FormControl sx={{ m: 1, width: '35ch' }} variant="outlined">
                                        <InputLabel htmlFor="outlined-adornment-password">Mật khẩu cũ</InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-password"
                                            name = 'MatKhauCu'
                                            onChange={handleChange}
                                            type={values.showPassword ? 'text' : 'password'}
                                            endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                                >
                                                {values.showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                            }
                                            label="Mật khẩu cũ"
                                        />
                                </FormControl>

                                <FormControl sx={{ m: 1, width: '35ch' }} variant="outlined">
                                        <InputLabel htmlFor="outlined-adornment-password">Mật khẩu mới</InputLabel>
                                        <OutlinedInput
                                            id="outlined-password"
                                            name = 'MatKhauMoi'
                                            onChange={handleChange}
                                            type={values.showPassword ? 'text' : 'password'}
                                            endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                                >
                                                {values.showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                            }
                                            label="Mật khẩu mới"
                                        />
                                </FormControl>

                                <FormControl sx={{ m: 1, width: '35ch' }} variant="outlined">
                                        <InputLabel htmlFor="outlined-adornment-password"> Xác nhận mật khẩu</InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-password"
                                            name = "cf_MatKhau"
                                            onChange={handleChange}
                                            type={values.showPassword ? 'text' : 'password'}
                                            endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                                >
                                                {values.showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                            }
                                            label="Xác nhận mật khẩu"
                                        />
                                </FormControl>
                                {
                                    loading ? <LoadingButton sx={{width: '41ch' }} loading loadingIndicator="Đang xử lý..." variant="outlined">Fetch data</LoadingButton>
                                            : <Button type = 'submit' color = 'primary' onClick={handleSubmit} sx={{width: '41ch' }} variant='contained' style ={btstyle}> Cập nhật</Button>
                                }       
                                <Typography>{err && showErrMsg(err)} </Typography>
                                <Typography>{success && showSuccessMsg(success)}</Typography>
                            </Paper>
                    </Grid>
                </div>
            </div>
        </div>
        )
    }
    </>
  );
}
