import React, { useState } from 'react';
import { FormControlLabel, Checkbox, FormControl, Grid, Paper, Avatar, TextField, Typography, Button, InputLabel, OutlinedInput, IconButton} from '@mui/material'
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { Link } from 'react-router-dom';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import {isMatch} from '../component/unitl/validation/validation'
import { showErrMsg, showSuccessMsg} from '../component/unitl/notification/notification'
import axios from 'axios';

export default function Register() {
    const paperStyle = {padding: 30, height: '70vh', width: 420, margin: "65px auto"};
    const avataStyle = {backgroundColor: 'black'};
    const btstyle = {margin:'8px 0'};
    
    const initiaiState = {
        Email: '',
        MatKhau: '',
        cf_password:'',
        err: '',
        success: '',
        showPassword: false,
    };
       
    const [user, setUser] = useState(initiaiState);
    const [checked, setChecked] = React.useState(false); // checkbox
    const {Email, MatKhau, cf_password, err, success} = user;

// Khởi tạo các biến để xử lý dữ liệu
    const handleChange = e => {
        const {name, value} = e.target
        setUser({...user, [name]:value, err:'', success:''});
        setChecked(e.target.checked);
      };

// Hàm xử lý submit lên server
    const handleSubmit = async e => {
        e.preventDefault()    
        if(!isMatch(MatKhau, cf_password))
            return setUser({...user, err: "Mật khẩu xác nhận không khớp.", success: ''});

// Gọi API bên back-end
        try {
          const res = await axios.post("http://localhost:5000/user/register", {
             Email, MatKhau, checked
          });
          setUser({...user, err:'', success: res.data.msg});
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
                        <Avatar style = {avataStyle}> <VpnKeyIcon/> </Avatar>
                        <h2>Đăng ký</h2>
                    </Grid>
                        <TextField
                            required
                            id="outlined-textarea"
                            label="Email"
                            name = 'Email'
                            onChange={handleChange}
                            sx={{ m: 1, width: '40ch' }}
                        />
                        <FormControl sx={{ m: 1, width: '40ch' }} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">Mật khẩu</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password"
                                name = 'MatKhau'
                                onChange={handleChange}
                                type={user.showPassword ? 'text' : 'password'}
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
                                label="Mật khẩu"
                            />
                    </FormControl>
                    <FormControl sx={{ m: 1, width: '40ch' }} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password"> Xác nhận mật khẩu</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password"
                                name = "cf_password"
                                onChange={handleChange}
                                type={user.showPassword ? 'text' : 'password'}
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
                                label="Xác nhận mật khẩu"
                            />
                    </FormControl>
                    <FormControlLabel control={<Checkbox name='checkVaiTro' checked={checked} onChange={handleChange} title='Đăng ký tài khoản của chủ cửa hàng'  color='primary' />} label="Tài khoản của người bán hàng" />
                    <Button type = 'submit' color = 'primary' onClick={handleSubmit} fullWidth variant='contained' style ={btstyle}> Đăng ký</Button>
                    <Typography> Bạn đã có tài khoản? 
                        <Link to={'/login'}>
                            Đăng nhập 
                        </Link>
                        {err && showErrMsg(err)}
                        {success && showSuccessMsg(success)}
                    </Typography>
                </Paper>
            </Grid>
    </div>
  );
}
