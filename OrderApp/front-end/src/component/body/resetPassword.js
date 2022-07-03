import React, { useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import { showErrMsg, showSuccessMsg} from '../unitl/notification/notification';
import {FormControl,InputAdornment, Grid, Paper, Button, InputLabel, OutlinedInput, IconButton} from '@mui/material';
import {isMatch} from '../unitl/validation/validation'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function ResetPassword() {
    const paperStyle = {padding: 30, height: '47vh', width: 410, margin: "125px auto"};
    const btstyle = {margin:'8px 0' };

    const initiaiState = {
        MatKhau: '',
        cf_MatKhau: '',
        err: '',
        success: '',
        showPassword: false,
    };
    const history = useHistory();
    const [data, setData] = useState(initiaiState);
    const {token} = useParams();
    const {MatKhau, cf_MatKhau, err, success} = data;
    

    const handleChangeInput = e => {
        const {name, value} = e.target;
        setData({...data, [name]:value, err:'', success:''});
    }

    const handleReset = async (e) => {
        e.preventDefault();
        if(!isMatch(MatKhau, cf_MatKhau))
            return setData({...data, err: "Mật khẩu xác nhận không khớp.", success: ''});
        try {
          const res = await axios.post("http://localhost:5000/user/reset", {MatKhau}, {
              headers: {Authorization: token}
          })
            setData({...data, err:'', success: res.data.msg}); 
        } catch (err) {
            err.response.data.msg && 
            setData({...data, err: err.response.data.msg, success: ''});
        }
        
    }

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
  return (
        <div>
           <div className="container">
                <Link to = {"/"} className="navbar-brand d-inline-flex"><img className="d-inline-block" src="assets/img/gallery/logo.svg" alt="logo" /><span className="text-1000 fs-3 fw-bold ms-2 text-gradient">oderFood</span></Link>
            </div>

            <Grid>
                <Paper elevation = {10} style = {paperStyle}>
                    <Grid align = 'center'>
                        <h2>Cập nhật lại mật khẩu của bạn</h2>
                    </Grid>
                                    <FormControl sx={{ m: 1, width: '38ch' }} variant="outlined">
                                        <InputLabel htmlFor="outlined-adornment-password">Mật khẩu mới</InputLabel>
                                        <OutlinedInput
                                            id="outlined-password"
                                            name = 'MatKhau'
                                            onChange={handleChangeInput}
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

                                <FormControl sx={{ m: 1, width: '38ch' }} variant="outlined">
                                        <InputLabel htmlFor="outlined-adornment-password"> Xác nhận mật khẩu</InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-password"
                                            name = "cf_MatKhau"
                                            onChange={handleChangeInput}
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
                                {err && showErrMsg(err)}
                                {success && showSuccessMsg(success)}
                                <Button type = 'submit' color = 'primary' onClick={handleReset} fullWidth variant='contained' style ={btstyle}> Cập nhật</Button>
                            </Paper>
                    </Grid>
       </div>
  );
}
