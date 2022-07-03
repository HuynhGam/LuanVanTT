import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '../admin/sidebar';
import { useHistory } from 'react-router-dom';
import {useSelector} from 'react-redux';
import { showErrMsg, showSuccessMsg} from '../../component/unitl/notification/notification';
import { Grid, Paper, Avatar, Button, TextField, FormControl, MenuItem, Select, InputLabel, Typography} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

 
export default function Add_Shipper() {
    const paperStyle = {padding: 25, height: '60vh', width:725, margin: "70px auto"};
    const avataStyle = {backgroundColor: 'black'};

    const [loading, setLoading] = useState(false);
    const auth = useSelector(state => state.auth);
    
    const {role} = auth;

    const initiaiState = {
        HoTen: '',
        Email: '',
        SDT: '',
        GioiTinh: '',
        DiaChiHienTai: '',
        NgaySinh: '',
        err: '',
        success: '',
    };
    const [data, setData] = useState(initiaiState);

    // Khởi tạo các biến để xử lý dữ liệu
    const handleChange = e => {
        const {name, value} = e.target;
        setData({...data, [name]:value, err:'', success:''});
      };

    const {HoTen, Email, SDT, GioiTinh, DiaChiHienTai, NgaySinh, err, success} = data;

    // Hàm xử lý submit lên server
    const handleSubmit = async e => {
        e.preventDefault() 
        setLoading(true)     
        // Gọi API bên back-end
        try {
            const res = await axios.post("http://localhost:5000/user/add_shipper", {
                HoTen, Email, SDT, GioiTinh, DiaChiHienTai, NgaySinh    
            });
            setTimeout(() => {
                setData({...data, err:'', success: res.data.msg});
                setLoading(false);
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
        <div id="app">
            <div id="sidebar" class="active">
                <Sidebar/>
            </div>

            <div id="main">     
                <div class="page-content">
                <Grid>
                            <Paper elevation = {10} style = {paperStyle}>
                                <Grid align = 'center'>
                                    <h2>Thông tin Shipper</h2>
                                </Grid>
                                <TextField
                                    required
                                    id="outlined-multiline-flexible"
                                    label="Họ tên"
                                    name="HoTen"
                                    multiline
                                    maxRows={2}
                                    sx={{ m: 2, width: '38ch' }}
                                    onChange = {handleChange}
                                />
                                 <TextField
                                    required
                                    id="outlined-textarea"
                                    label="Ngày sinh"
                                    name = 'NgaySinh'
                                    sx={{ m: 2, width: '14ch', marginLeft: 3}}
                                    onChange = {handleChange}
                                />
                                 <FormControl sx={{ m: 2, width: '13ch', marginTop: -9.1, marginLeft: 68 }}>
                                        <InputLabel id="demo-simple-select-label">Giới tính</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            label="Giới tính"
                                            name= 'GioiTinh'
                                            onChange = {handleChange}                                            
                                        >
                                            <MenuItem value={0}>Nam</MenuItem>
                                            <MenuItem value={1}>Nữ</MenuItem>
                                        </Select>
                                    </FormControl>
                                <TextField
                                    required
                                    id="outlined-multiline-flexible"
                                    label="Email"
                                    name="Email"
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
                                    sx={{ m: 2, width: '28ch', marginLeft:5, marginTop: 1.9 }}
                                    onChange = {handleChange}
                                />
                                <TextField
                                    required
                                    id="outlined-textarea"
                                    label="Địa chỉ hiện tại"
                                    name = 'DiaChiHienTai'
                                    sx={{ m: 2, width: '74ch' }}
                                    onChange = {handleChange}
                                />
                                
                                
                                    {
                                        loading ? <LoadingButton sx={{width: '45ch', margin:'8px 0', marginLeft: 20 }} loading loadingIndicator="Đang xử lý..." variant="outlined">Fetch data</LoadingButton>
                                                : <Button type = 'submit' color = 'primary' onClick={handleSubmit} sx={{width: '45ch', margin:'8px 0', marginLeft: 20}} variant='contained' > Thêm</Button>
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
