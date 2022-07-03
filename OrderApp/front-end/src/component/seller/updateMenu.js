import React, { useState, useEffect } from 'react';
import { useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import Sidebar from '../seller/sidebar';
import { useParams, useHistory} from 'react-router-dom';
import { showErrMsg, showSuccessMsg} from '../../component/unitl/notification/notification';
import { Grid, Paper, Button, TextField, Select, MenuItem, InputLabel, FormControl, Input, Typography} from '@mui/material';
import NumberFormat from 'react-number-format';
import LoadingButton from '@mui/lab/LoadingButton';

// hàm nhập số tiền
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

// Css form update
const paperStyle = {padding: 25, height: '110vh', width: 400, margin: "-15px auto"};
const btstyle = {margin:'8px 0'};

export default function Update_Menu() {

    const initiaiState = {
        TenMonAn: '',
        Loai: '',
        GiaBan: '',
        TrangThai:'',
        HinhAnh:''
    };
  
// Tạo biến id được lấy trên thanh url
    const {id} = useParams();
    const history = useHistory();

    const [data, setData] = useState(initiaiState);
    const [editMenu, setEditMenu] = useState([]);

    const menu = useSelector(state => state.menu);
    const token = useSelector(state => state.token);

    const [loading, setLoading] = useState(true);
    const [loadingbtt, setLoadingbtt] = useState(false);

    const [helperText, setHelperText] = useState('');
    const [error, setError] = useState(false);

    const [TenMonAn, setTenMonAn] = useState('');
    const [MoTa, setMoTa] = useState('');
    const [Loai, setLoai] = useState('');
    const [GiaBan, setGiaBan] = useState('');
    const [HinhAnh, setHinhAnh] = useState('');
    const [TrangThai, setTrangThai] = useState('');
    const [SoLuongCon, setSoLuongCon] = useState('');
// Tối ưu lại useState
    

//Lấy thông tin dựa trên id
    useEffect(() => {
        if(menu.length !== 0){
            menu.forEach(store => {
                if(store._id === id){
                    setEditMenu(store);
                }
            })
        }else{
            history.push('/store');
        }
    },[menu, id, history])

// Các sự kiện nhập dữ liệu
    const ChangeTenMonAn = e => {
            setTenMonAn(e.target.value)
            setHelperText('')
            setError(false)
        };

    const ChangeMoTa = e => {
            setMoTa(e.target.value)
            setHelperText('')
            setError(false)
        };
    const ChangeLoai = e => {
        setLoai(e.target.value)
        setHelperText('')
        setError(false)
        };

    const ChangeGiaBan = e => {
        setGiaBan(e.target.value)
        setHelperText('')
        setError(false)
        };
    
    const ChangeTrangThai = e => {
        setTrangThai(e.target.value)
        setHelperText('')
        setError(false)
        };

    const ChangeSoLuong = e => {
        setSoLuongCon(e.target.value)
        setHelperText('')
        setError(false)
        };

// Sự kiện nhập ảnh
    const uploadImage = async(e) => {
        e.preventDefault()
        try {
            const file = e.target.files[0]

            if(!file) return setError(true), setHelperText('Không tìm thấy file bạn tải lên')

            if(file.size > 1024 * 1024)
            return setError(true), setHelperText('Kích thước ảnh quá lớn')

            if(file.type !== 'image/jpeg' && file.type !== 'image/png')
                return setError(true), setHelperText('File bạn chọn không hợp lệ')

            let formData =  new FormData()
            formData.append('file', file)

            const res = await axios.post('http://localhost:5000/api/upload_image', formData)

            setLoading(false) // Gỡ ảnh cũ xuống
            setHinhAnh(res.data.url)
            
        } catch (err) {
            setData({...data, err: err.response.data.msg , success: ''})
        }
    }
  
// Hàm xử lý submit lên server
const handleSubmit = async e => {
    e.preventDefault()      
    setLoadingbtt(true)
    if(data === '')
         {
            setTimeout(() => {
                setHelperText('Vui lòng nhập đầy đủ thông tin của bạn');
                setError(true);
                setLoadingbtt(false)
            }, 500);    
         }
       else{
            axios.patch(`http://localhost:5000/store/update_menu/${id}`, {
                TenMonAn: TenMonAn ? TenMonAn: editMenu.TenMonAn,
                Loai: Loai ? Loai: editMenu.Loai,
                MoTa: MoTa ? MoTa: editMenu.MoTa,
                GiaBan: GiaBan ? GiaBan: editMenu.GiaBan,
                TrangThai: TrangThai ? TrangThai: editMenu.TrangThai,
                HinhAnh: HinhAnh ? HinhAnh : editMenu.HinhAnh,
                SoLuongCon: SoLuongCon ? SoLuongCon: editMenu.SoLuongCon
            },{
                headers: {Authorization: token}
            })
            setTimeout(() => {
                setHelperText('Cập nhật thành công');
                setError(false)
                setLoadingbtt(false)
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
                                    <h2>Cập nhật món ăn</h2>
                                </Grid>
                                <TextField
                                    required
                                    id="outlined-textarea"
                                    label="Món ăn"
                                    name = 'TenMonAn'
                                    defaultValue = {editMenu.TenMonAn}
                                    key= {editMenu.TenMonAn}
                                    onChange={ChangeTenMonAn}
                                    sx={{ m: 1, width: '39ch' }}
                                />
                                <FormControl sx={{ m: 1, width: '39ch' }}>
                                    <InputLabel id="demo-simple-select-label">Loại</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label="Loại"
                                        name= 'Loai'
                                        onChange={ChangeLoai}
                                        defaultValue = {editMenu.Loai}
                                        key = {editMenu.Loai}
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
                                    id="outlined-textarea"
                                    label="Mô tả (không bắt buộc)"
                                    name = 'MoTa'
                                    multiline
                                    maxRows={4}
                                    defaultValue = {editMenu.MoTa}
                                    key= {editMenu.MoTa}
                                    onChange={ChangeMoTa}
                                    sx={{ m: 1, width: '39ch' }}
                                />
                                <TextField
                                    required
                                    id="outlined-textarea"
                                    label="Giá bán"
                                    name = 'GiaBan'
                                    onChange={ChangeGiaBan}
                                    value={data.numberformat}
                                    sx={{ m: 1, width: '39ch' }}
                                    defaultValue = {editMenu.GiaBan}
                                    key = {editMenu.GiaBan}
                                    InputProps={{
                                        inputComponent: NumberFormatCustom,
                                      }}
                                />
                                <TextField
                                    required
                                    id="outlined-textarea"
                                    label="Số lượng"
                                    name = 'SoLuongCon'
                                    onChange={ChangeSoLuong}
                                    sx={{ m: 1, width: '39ch' }}
                                    defaultValue = {editMenu.SoLuongCon}
                                    key = {editMenu.SoLuongCon}
                                    type = 'number'
                                />
                                <FormControl sx={{ m: 1, width: '39ch' }}>
                                    <InputLabel id="demo-simple-select-label">Trạng thái</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label="Trạng thái"
                                        name= 'TrangThai'
                                        onChange={ChangeTrangThai}
                                        defaultValue = {editMenu.TrangThai}
                                        key = {editMenu.TrangThai}
                                    >
                                        <MenuItem value={1}>Còn món</MenuItem>
                                        <MenuItem value={2}>Hết món</MenuItem>
                                    </Select>
                                </FormControl>
                                    <Input sx={{ m: 1, width: '38ch' }} name = 'file' accept="image/*" id="contained-button-file" type="file" onChange={uploadImage} />
                                    {   
                                      // Load ảnh cũ lên khi là true
                                        loading?(
                                            <img src={editMenu.HinhAnh} key = {editMenu.HinhAnh} style= {{width:'230px', height:'200px', display: 'block', marginLeft: 'auto', marginRight:'auto'}}></img>
                                        ):(
                                            <img src={HinhAnh} key = {HinhAnh} style= {{width:'230px', height:'200px', display: 'block', marginLeft: 'auto', marginRight:'auto'}}></img>
                                        )
                                    }

                                    {
                                        loadingbtt ? <LoadingButton sx={{margin:'8px 0' }} fullWidth loading loadingIndicator="Đang xử lý..." variant="outlined">Fetch data</LoadingButton>
                                                : <Button type = 'submit' color = 'primary' onClick={handleSubmit} fullWidth variant='contained' style ={btstyle}>Cập nhật</Button>   
                                    }       
       
                                    
                                    {
                                        error === true ? (
                                            <><Typography> {showErrMsg(helperText)}</Typography></> 
                                        ) : (
                                            <><Typography>{showSuccessMsg(helperText)}</Typography></> 
                                        )
                                    }
                            </Paper>
                        </Grid>
                </div>
            </div>
        </div>
    </>
  );
}
