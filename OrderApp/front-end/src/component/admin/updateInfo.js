
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory, useParams} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { showErrMsg, showSuccessMsg} from '../../component/unitl/notification/notification';
import {TextField, Grid, Paper, Button, FormControl, MenuItem, Select, InputLabel, Typography } from '@mui/material';
import Sidebar from './sidebar';
import LoadingButton from '@mui/lab/LoadingButton';
    
    
const paperStyle = {padding: 32, height: '50vh', width: 430, margin: "100px auto"}
const btstyle = {margin:'8px 0'}
    
export default function Update_info() {
        const {id} = useParams();
        const [editUser, setEditUser] = useState([]);

        const history = useHistory();
        const token = useSelector(state => state.token);
       
        const infor = useSelector(state => state.infor);
        const {sellers, users} = infor;

        const [loading, setLoading] = useState(false);

        useEffect(() => {
            if(sellers.length !== 0){
                sellers.forEach(seller => {
                    if(seller._id === id){
                        setEditUser(seller);
                    }
                })
            }else{
                history.push('/admin')
            }
        },[sellers, id, history])

        useEffect(() => {
            if(users.length !== 0){
                users.forEach(user => {
                    if(user._id === id){
                        setEditUser(user);
                    }
                })
            }else{
                history.push('/admin');
            }
        },[users, id, history])

    const initiaiState = {
        Email: '',
        TrangThai: '',
        err: '',
        success: ''
    };
    const [data, setData] = useState(initiaiState);

    const handleChange = e => {
        const {name, value} = e.target;
        setData({...data, [name]:value, err:'', success:''});

      };

      const {Email, TrangThai, err, success} = data;

      const handleSubmit = async e => {
        e.preventDefault(); 
        setLoading(true)
            try {
                const res = await axios.patch(`http://localhost:5000/user/update/${editUser._id}`, {
                    Email: Email ? Email: editUser.Email, 
                    TrangThai: TrangThai ? TrangThai: editUser.TrangThai     
                },{
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
            <div id="app">
                <div id="sidebar" class="active">
                    <Sidebar/>
                </div>
                <div id="main">     
                    <div class="page-content">
                            <Grid>
                                <Paper elevation = {10} style = {paperStyle}>
                                    <Grid align = 'center'>
                                        <h2>Chỉnh sửa thông tin</h2>
                                    </Grid>
                                    
                                    <TextField
                                        required
                                        id="outlined-textarea"
                                        label="Email"
                                        name = 'Email'
                                        defaultValue={editUser.Email}      
                                        key = {editUser.Email} 
                                        onChange = {handleChange}                         
                                        sx={{ m: 2, width: '39ch' }}
                                    />
                                    <FormControl sx={{ m: 2, width: '39ch' }}>
                                        <InputLabel id="demo-simple-select-label">Trạng thái</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            label="Trạng thái"
                                            name= 'TrangThai'
                                            defaultValue={editUser.TrangThai}      
                                            key = {editUser.TrangThai} 
                                            onChange = {handleChange}  
                                        >
                                            <MenuItem value={1}>Hoạt động</MenuItem>
                                            <MenuItem value={2}>Đã khóa</MenuItem>
                                        </Select>
                                    </FormControl>
                                    {
                                        loading ? <LoadingButton sx={{width: '47ch', margin:'8px 0' }} loading loadingIndicator="Đang xử lý..." variant="outlined">Fetch data</LoadingButton>
                                                : <Button type = 'submit' color = 'primary' onClick={handleSubmit} sx={{width: '47ch' }} variant='contained' style ={btstyle}> Cập nhật</Button>
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
    