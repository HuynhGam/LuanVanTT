import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '../seller/sidebar';
import { useHistory } from 'react-router-dom';
import {useSelector} from 'react-redux';
import { showErrMsg, showSuccessMsg} from '../../component/unitl/notification/notification';
import { Grid, Paper, Avatar, Button, TextField, Typography} from '@mui/material';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import LoadingButton from '@mui/lab/LoadingButton';

 
export default function Add_Store() {
    const paperStyle = {padding: 25, height: '78vh', width: 400, margin: "80px auto"};
    const avataStyle = {backgroundColor: 'black'};
    const btstyle = {margin:'8px 0'};

    const [loading, setLoading] = useState(false);
    const auth = useSelector(state => state.auth);
    
    const {role} = auth;

    const initiaiState = {
        TenCH: '',
        DiaChi: '',
        Email: role.Email,
        SDT: '',
        err: '',
        success: '',
    };
    const [store, setStore] = useState(initiaiState);

    // Khởi tạo các biến để xử lý dữ liệu
    const handleChange = e => {
        const {name, value} = e.target;
        setStore({...store, [name]:value, err:'', success:''});
      };

    const {TenCH, DiaChi, Email, SDT, err, success} = store;

    // Hàm xử lý submit lên server
    const handleSubmit = async e => {
        e.preventDefault() 
        setLoading(true)     
        // Gọi API bên back-end
        try {
            const res = await axios.post("http://localhost:5000/store/create_shop", {
                TenCH, DiaChi, Email, SDT
            });
            setTimeout(() => {
                setStore({...store, err:'', success: res.data.msg});
                setLoading(false);
            }, 500);    
          } catch (err) {
              setTimeout(() => {
                err.response.data.msg && 
                setStore({...store, err: err.response.data.msg, success: ''});
                setLoading(false)
              }, 500);
             
          }
      }

  return (
    <>
        <div id="app">
            <div id="sidebar" class="active">
                <Sidebar/>
            </div>

            <div id="main">     
                <div class="page-content">
                <Grid>
                            <Paper elevation = {10} style = {paperStyle}>
                                <Grid align = 'center'>
                                    <Avatar style = {avataStyle}> <AddBusinessIcon/> </Avatar>
                                    <h2>Thông tin cửa hàng</h2>
                                </Grid>
                                <TextField
                                    required
                                    id="outlined-multiline-flexible"
                                    label="Tên cửa hàng"
                                    name="TenCH"
                                    multiline
                                    maxRows={2}
                                    sx={{ m: 2, width: '38ch' }}
                                    onChange = {handleChange}
                                />
                                <TextField
                                    required
                                    id="outlined-multiline-flexible"
                                    label="Địa chỉ"
                                    name="DiaChi"
                                    multiline
                                    maxRows={4}
                                    sx={{ m: 2, width: '38ch' }}
                                    onChange = {handleChange}
                                />
                                 <TextField
                                    required
                                    id="outlined-textarea"
                                    label="Số điện thoại"
                                    name = 'SDT'
                                    sx={{ m: 2, width: '38ch' }}
                                    onChange = {handleChange}
                                />
                                <TextField
                                    id="outlined-textarea"
                                    label="Email"
                                    name = 'Email'
                                    disabled
                                    sx={{ m: 2, width: '38ch' }}
                                    defaultValue = {role.Email}
                                />
                                    {
                                        loading ? <LoadingButton sx={{width: '45ch', margin:'8px 0' }} loading loadingIndicator="Đang xử lý..." variant="outlined">Fetch data</LoadingButton>
                                                : <Button type = 'submit' color = 'primary' onClick={handleSubmit} sx={{width: '45ch' }} variant='contained' style ={btstyle}> Thêm</Button>
                                    }       
                                    <Typography>{err && showErrMsg(err)} </Typography>
                                    <Typography>{success && showSuccessMsg(success)}</Typography>   
                            </Paper>
                        </Grid>
                </div>
            </div>
        </div>
    </>
  );
}
