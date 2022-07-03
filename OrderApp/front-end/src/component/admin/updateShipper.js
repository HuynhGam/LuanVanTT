import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../admin/sidebar';
import { useHistory, useParams } from 'react-router-dom';
import {useSelector} from 'react-redux';
import { showErrMsg, showSuccessMsg} from '../../component/unitl/notification/notification';
import { Grid, Paper, Avatar, Button, TextField, Typography, FormControl, InputLabel, Select, MenuItem} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

 
export default function Update_Shipper() {
    const paperStyle = {padding: 25, height: '70vh', width: 405, margin: "70px auto"};
    const btstyle = {margin:'8px 0'};

    const {id} = useParams();
    const history = useHistory();

    const [loading, setLoading] = useState(false);
    const [editInfor, setEditInfor] = useState([]);

    const shippers = useSelector(state => state.shippers);

    useEffect(() => {
        if(shippers.length !== 0){
            shippers.forEach(shipper => {
                if(shipper._id === id){
                    setEditInfor(shipper);
                }
            })
        }else{
            history.push('/shipper');
        }
    },[shippers, id, history])

    const initiaiState = {
        HoTen: '',
        Email: '',
        SDT: '',
        TrangThai:'',
        err: '',
        success: '',
    };
    const [data, setData] = useState(initiaiState);

    // Khởi tạo các biến để xử lý dữ liệu
    const handleChange = e => {
        const {name, value} = e.target;
        setData({...data, [name]:value, err:'', success:''});
      };

    const {HoTen, Email, SDT, TrangThai, err, success} = data;

    // Hàm xử lý submit lên server
    const handleSubmit = async e => {
        e.preventDefault() 
        setLoading(true)     
        // Gọi API bên back-end
        try {
            const res = await axios.patch(`http://localhost:5000/user/update_shipper/${editInfor._id}`, {
                HoTen: HoTen ? HoTen: editInfor.HoTen, 
                Email: Email ? Email: editInfor.Email, 
                SDT: SDT ? SDT: editInfor.SDT,
                TrangThai: TrangThai ? TrangThai: editInfor.TrangThai
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
                                    defaultValue= {editInfor.HoTen}
                                    key = {editInfor.HoTen}
                                />
                                <TextField
                                    required
                                    id="outlined-multiline-flexible"
                                    label="Email"
                                    name="Email"
                                    multiline
                                    maxRows={4}
                                    sx={{ m: 2, width: '38ch' }}
                                    onChange = {handleChange}
                                    defaultValue= {editInfor.Email}
                                    key = {editInfor.Email}
                                />
                                 <TextField
                                    required
                                    id="outlined-textarea"
                                    label="Số điện thoại"
                                    name = 'SDT'
                                    sx={{ m: 2, width: '38ch' }}
                                    onChange = {handleChange}
                                    defaultValue= {editInfor.SDT}
                                    key = {editInfor.SDT}
                                />
                                 <FormControl sx={{ m: 2, width: '38ch' }}>
                                        <InputLabel id="demo-simple-select-label">Trạng thái</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            label="Trạng thái"
                                            name= 'TrangThai'
                                            defaultValue={editInfor.TrangThai}      
                                            key = {editInfor.TrangThai} 
                                            onChange = {handleChange}  
                                        >
                                            <MenuItem value={1}>Hoạt động</MenuItem>
                                            <MenuItem value={2}>Đã khóa</MenuItem>
                                        </Select>
                                    </FormControl>
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
