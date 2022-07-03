import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { showErrMsg, showSuccessMsg} from '../unitl/notification/notification';
import { Grid, Paper, Typography, Button, InputLabel, OutlinedInput} from '@mui/material';


export default function ForgotPassword() {
    const paperStyle = {padding: 30, height: '35vh', width: 410, margin: "150px auto"}
    const btstyle = {margin:'8px 0' }

    const initiaiState = {
        Email: '',
        err: '',
        success: '',
    }
      
// Khởi tạo email và password của user nhập vào
    const [data, setData] = useState(initiaiState);
    const {Email, err, success} = data;

    const handleChangeInput = e => {
        const {name, value} = e.target;
        setData({...data, [name]:value, err:'', success:''});
      }

    const forgotPassword = async () => {
        try {
            const res = await axios.post('http://localhost:5000/user/forgot', {Email});
            return setData({...data, err: '', success: res.data.msg});
        } catch (err) {
            err.response.data.msg && setData({...data, err: err.response.data.msg, success: ''});
        }
    }
  return (
        <div>
           <div className="container">
                <Link to = {"/"} className="navbar-brand d-inline-flex"><img className="d-inline-block" src="assets/img/gallery/logo.svg" alt="logo" /><span className="text-1000 fs-3 fw-bold ms-2 text-gradient">oderFood</span></Link>
            </div>

            <Grid>
                <Paper elevation = {10} style = {paperStyle}>
                    <Grid align = 'center'>
                        <Typography variant='caption'>Vui lòng nhập địa chỉ email đã đăng ký của bạn để tiến hành khôi phục lại mật khẩu</Typography>
                    </Grid>
                        <InputLabel htmlFor="outlined-adornment">Email</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment"
                                name='Email'
                                onChange={handleChangeInput}
                                label="Email"
                               fullWidth
                            />
                        {err && showErrMsg(err)}
                        {success && showSuccessMsg(success)}
                        <Button type = 'submit' onClick={forgotPassword} color = 'primary' variant='contained' style ={btstyle}> Tiếp theo</Button>
                </Paper>
            </Grid>
       </div>
  );
}
