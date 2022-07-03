import React, { useState } from 'react';
import { useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import Sidebar from '../seller/sidebar'
import { useParams, useHistory} from 'react-router-dom';
import { showErrMsg, showSuccessMsg} from '../../component/unitl/notification/notification';
import { Grid, Paper, Button, TextField, Select, MenuItem, InputLabel, FormControl, Input, Typography} from '@mui/material';
import NumberFormat from 'react-number-format';
import LoadingButton from '@mui/lab/LoadingButton';
import ReactLoading from 'react-loading';


const NumberFormatCustom = React.forwardRef(function NumberFormatCustom(props, ref) {
    const { onChange, ...other } = props;
  
    return (
      <NumberFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        thousandSeparator
        isNumericString
      />
    );
  });

  NumberFormatCustom.propTypes = {
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  };
  


export default function Add_Menu() {
    
    const paperStyle = {padding: 25, height: '100vh', width: 480, margin: "15px auto"};
    const btstyle = {margin:'8px 0'};


    const [image, setImage] = useState('');
    const [loadingimg, setLoadingimg] = useState(false);
    const [loading, setLoading] = useState(false);

    const token = useSelector(state => state.token);
    const {id} = useParams();

    const initiaiState = {
        id_CH: id,
        TenMonAn: '',
        Loai: '',
        MoTa:'',
        GiaBan: '',
        err: '',
        success: '',
    };
    const [data, setData] = useState(initiaiState);
 
  
    const uploadImage = async(e) => {
        e.preventDefault();
        try {
            const file = e.target.files[0];

            if(!file) return setData({...data, err: "No files were uploaded." , success: ''});

            if(file.size > 1024 * 1024)
                return setData({...data, err: "Size too large." , success: ''});

            if(file.type !== 'image/jpeg' && file.type !== 'image/png')
                return setData({...data, err: "File format is incorrect." , success: ''});

            let formData =  new FormData();
            formData.append('file', file);

            setLoadingimg(true);
            const res = await axios.post('http://localhost:5000/api/upload_image', formData);

            setLoadingimg(false);
            setImage(res.data.url);
            
        } catch (err) {
            setData({...data, err: err.response.data.msg , success: ''});
        }
    }

    // Khởi tạo các biến để xử lý dữ liệu
    const handleChange = e => {
        const {name, value} = e.target;
        setData({...data, [name]:value, err:'', success:''});

      };

    const {id_CH, TenMonAn, Loai, MoTa, GiaBan, err, success} = data;

     // Hàm xử lý submit lên server
     const handleSubmit = async e => {
        e.preventDefault();     
        setLoading(true) 
        // Gọi API bên back-end
        try {
            const res = await axios.post("http://localhost:5000/store/create_food", {
                id_CH, TenMonAn, Loai, MoTa, GiaBan, HinhAnh: image
            });
            setTimeout(() => {
                setData({...data, err:'', success: res.data.msg})
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
                                    <h2>Thêm món ăn</h2>
                                </Grid>
                                <TextField
                                    required
                                    id="outlined-textarea"
                                    label="Món ăn"
                                    name = 'TenMonAn'
                                    onChange={handleChange}
                                    sx={{ m: 1, width: '48ch' }}
                                />
                                <FormControl sx={{ m: 1, width: '48ch' }}>
                                    <InputLabel id="demo-simple-select-label">Loại</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label="Loại"
                                        name= 'Loai'
                                        onChange={handleChange}
                                    >
                                        <MenuItem value={'Cơm'}>Cơm</MenuItem>
                                        <MenuItem value={'Trà sữa'}>Trà sữa</MenuItem>
                                        <MenuItem value={'Bánh mì'}>Bánh mì</MenuItem>
                                        <MenuItem value={'Bún Mỳ'}>Bún/Mỳ</MenuItem>
                                        <MenuItem value={'Ăn vặt'}>Ăn vặt</MenuItem>
                                        <MenuItem value={'Phở'}>Phở</MenuItem>
                                        <MenuItem value={'Khác'}>Khác</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField
                                    id="filled-multiline-flexible"
                                    label="Mô tả (không bắt buộc)"
                                    name= 'MoTa'
                                    multiline
                                    maxRows={4}
                                    onChange={handleChange}
                                    sx={{ m: 1, width: '48ch' }}
                                />
                                <TextField
                                    required
                                    id="outlined-textarea"
                                    label="Giá bán"
                                    name = 'GiaBan'
                                    onChange={handleChange}
                                    value={data.numberformat}
                                    sx={{ m: 1, width: '48ch' }}
                                    InputProps={{
                                        inputComponent: NumberFormatCustom,
                                      }}
                                />
                                    <Input sx={{ m: 1, width: '45ch' }} name = 'file' accept="image/*" id="contained-button-file" type="file" onChange={uploadImage} />
                                    {
                                        loadingimg?(
                                            <ReactLoading type='spin' color='#000000' style = {{marginLeft: 145, marginTop: 45 , height: 150, width: 120}} /> 
                                        ):(
                                            <img src={image} style= {{width:'230px', height:'200px', display: 'block', marginLeft: 'auto', marginRight:'auto'}}></img>
                                        )
                                    }

                                    {
                                        loading ? <LoadingButton sx={{width: '55ch', margin:'8px 0' }} loading loadingIndicator="Đang xử lý..." variant="outlined">Fetch data</LoadingButton>
                                                : <Button type = 'submit' color = 'primary' onClick={handleSubmit} sx={{width: '55ch' }} variant='contained' style ={btstyle}> Thêm</Button>
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
