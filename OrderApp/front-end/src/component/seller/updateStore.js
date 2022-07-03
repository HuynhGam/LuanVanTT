import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../seller/sidebar'
import { useHistory, useParams } from 'react-router-dom';
import { showErrMsg, showSuccessMsg} from '../../component/unitl/notification/notification';
import { useSelector } from 'react-redux';
import { Grid, Paper, Avatar, Button, TextField, FormControl, InputLabel, Select, MenuItem, Typography} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';


const paperStyle = {padding: 25, height: '73vh', width: 400, margin: "70px auto"};
const btstyle = {margin:'8px 0'};

export default function Update_Store() {
  
// Tạo biến id được lấy trên thanh url
    const {id} = useParams();
    const history = useHistory();

    const [editStore, setEditStore] = useState([]);
    const [helperText, setHelperText] = useState('');

    const stores = useSelector(state => state.stores);
    const token = useSelector(state => state.token);

    const auth = useSelector(state => state.auth);   
    const {role} = auth

    const [loading, setLoading] = useState(false);

//Lấy thông tin dựa trên id
    useEffect(() => {
        if(stores.length !== 0){
            stores.forEach(store => {
                if(store._id === id){
                    setEditStore(store);
                }
            })
        }else{
            history.push('/store');
        }
    },[stores, id, history])


        const initiaiState = {
            TenCH: '',
            DiaChi: '',
            SDT: '',
            TrangThai: '',
            err: '',
            success: ''
        };
        const [data, setData] = useState(initiaiState);
    
        const handleChange = e => {
            const {name, value} = e.target;
            setData({...data, [name]:value, err:'', success:''});
    
          };
    
          const {TenCH, DiaChi, SDT, TrangThai, err, success} = data;
    
          const handleSubmit = async e => {
            e.preventDefault(); 
            setLoading(true)
                try {
                    const res = await axios.patch(`http://localhost:5000/store/update_shop/${editStore._id}`, {
                        TenCH: TenCH ? TenCH: editStore.TenCH,
                        DiaChi: DiaChi ? DiaChi: editStore.DiaChi,
                        SDT: SDT ? SDT: editStore.SDT,
                        TrangThai: TrangThai ? TrangThai: editStore.TrangThai,
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
                                    defaultValue = {editStore.TenCH}
                                    key = {editStore.TenCH}
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
                                    defaultValue = {editStore.DiaChi}
                                    key = {editStore.DiaChi}
                                />
                                 <TextField
                                    required
                                    id="outlined-textarea"
                                    label="Số điện thoại"
                                    name = 'SDT'
                                    type = 'number'
                                    sx={{ m: 2, width: '38ch' }}
                                    onChange = {handleChange}
                                    defaultValue = {editStore.SDT}
                                    key = {editStore.SDT}
                                />
                                <FormControl sx={{ m: 2, width: '38ch' }}>
                                    <InputLabel id="demo-simple-select-label">Trạng thái</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label="Trạng thái"
                                        name= 'TrangThai'
                                        onChange = {handleChange}
                                        defaultValue = {editStore.TrangThai}
                                        key = {editStore.TrangThai}
                                    >
                                        <MenuItem value={1}>Còn kinh doanh</MenuItem>
                                        <MenuItem value={2}>Ngừng kinh doanh</MenuItem>
                                    </Select>
                                </FormControl>
                                {
                                    loading ? <LoadingButton sx={{width: '45ch', margin:'8px 0' }} loading loadingIndicator="Đang xử lý..." variant="outlined">Fetch data</LoadingButton>
                                            : <Button type = 'submit' color = 'primary' onClick={handleSubmit} sx={{width: '45ch' }} variant='contained' style ={btstyle}> Cập nhật</Button>
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
