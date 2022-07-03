import React, { useState } from 'react';
import {useDispatch} from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { showErrMsg, showSuccessMsg} from '../component/unitl/notification/notification';
import {dispatchLogin} from '../redux/actions/authAction';
import {InputAdornment, Grid, Paper, Avatar, Typography, Button, InputLabel, OutlinedInput, IconButton} from '@mui/material';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


export default function Login() {
    const paperStyle = {padding: 25, height: '65vh', width: 370, margin: "77px auto"};
    const avataStyle = {backgroundColor: 'black'};
    const btstyle = {margin:'8px 0'};

    const initiaiState = {
        Email: '',
        MatKhau: '',
        err: '',
        success: '',
        showPassword: false,
    };
      
// Khởi tạo email và password của user nhập vào
    const [user, setUser] = useState(initiaiState);
    const {Email, MatKhau, err, success} = user;
    
    const dispatch = useDispatch();

// Khởi tạo history để tạo đường dẫn 
    const history = useHistory();

// Khởi tạo các biến để xử lý dữ liệu
    const handleChangeInput = e => {
        const {name, value} = e.target;
        setUser({...user, [name]:value, err:'', success:''});
      };
  
// Hàm xử lý submit lên server
    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/user/login', {Email, MatKhau});
            setUser({...user, err: '', success: res.data.msg});
            localStorage.setItem('firstLogin', true);
            const {VaiTro} = res.data.data;
            dispatch(dispatchLogin());
            if(VaiTro === 1)
            {
                history.push("/");
            }
            else if(VaiTro ===2)
            {
                history.push("/seller");

            }
            else
            {
                history.push("/admin");
            }
           
        } catch (err) {
            err.response.data.msg && 
            setUser({...user, err: err.response.data.msg, success: ''});
        }
    }
    // Hàm show mật khẩu
      const handleClickShowPassword = () => {
        setUser({
          ...user,
          showPassword: !user.showPassword,
        });
      };
    // Hàm click chuột show
      const handleMouseDownPassword = (event) => {
        event.preventDefault();
      };


  return (
       <div>
           <div className="container">
                <Link to = {"/"} className="navbar-brand d-inline-flex"><img className="d-inline-block" src="assets/img/gallery/logo.svg" alt="logo" /><span className="text-1000 fs-3 fw-bold ms-2 text-gradient">oderFood</span></Link>
            </div>

            <Grid>
                <Paper elevation = {10} style = {paperStyle}>
                    <Grid align = 'center'>
                        <Avatar style = {avataStyle}> <LockOpenIcon/> </Avatar>
                        <h2>Đăng nhập</h2>
                    </Grid>
                        <InputLabel htmlFor="outlined-adornment">Email</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment"
                                name='Email'
                                value={Email}
                                onChange={handleChangeInput}
                                label="Email"
                                fullWidth
                            />
                        <InputLabel htmlFor="filled-adornment-password" >Mật khẩu</InputLabel>
                            <OutlinedInput
                                id="filled-adornment-password"
                                type={user.showPassword ? 'text' : 'password'}
                                onChange={handleChangeInput}
                                name = 'MatKhau'
                                fullWidth
                                endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                    >
                                    {user.showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                                }
                                label="Password"
                            />
                        
                        {/* <FormControlLabel control={<Checkbox name='check' color='primary'/>} label="Nhớ mật khẩu" /> */}
                        <Button type = 'submit' color = 'primary' onClick={handleSubmit} fullWidth variant='contained' style ={btstyle}> Đăng nhập</Button>
                        <Typography>
                            <Link to = {'/forgot_password'}>
                                Quên mật khẩu?
                            </Link>
                        </Typography>
                        <Typography> Bạn chưa có tài khoản? 
                            <Link to = {'/register'}>
                                Đăng ký 
                            </Link>
                        </Typography>
                        <Typography>
                        {err && showErrMsg(err)}
                        {success && showSuccessMsg(success)}
                        </Typography>
                </Paper>
            </Grid>
       </div>
  );
}
