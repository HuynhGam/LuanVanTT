import React, { useEffect, useState} from 'react';
import axios from 'axios';
import { useParams} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux'
import Header from '../header'
import Footer from '../footer';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {Box, Button, Grid, Typography, Rating, TextField, Select, FormControl, MenuItem, InputLabel, Divider} from '@mui/material';
import {fetchStore, dispatchGetStore} from '../../redux/actions/storeAction';
import {fetchRate, dispatchGetRate} from '../../redux/actions/rateAction';
import ReactMapGL, {Marker} from "react-map-gl";


function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  
export default function InforStore() {
    // TabPanel
    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
    // TabPanel

    const stores = useSelector(state => state.stores);
    const auth = useSelector(state => state.auth);
    const rating = useSelector(state => state.rating);
    const {role, isLogged} = auth;

    const [callback] = useState(false);
    const dispatch = useDispatch();

    const [togglePopup] = React.useState(false);
    const [addressMaker, setAddressMaker] = useState([])

    const [Sao, setSao] = React.useState(0); // Tạo biến để gửi qua back-end
        const handleChangeRating = e => {
            setSao(e.target.value); 
        };
    const [MonAn, setMonAn] = React.useState(''); // Tạo biến để gửi qua back-end
        const handleChangeSelect = e => {
            setMonAn(e.target.value);
        };
    const [DanhGia, setDanhGia] = React.useState(''); // Tạo biến để gửi qua back-end
        const handleChangeText = e => {
            setDanhGia(e.target.value);
        };

    const {id} = useParams();

    useEffect(() =>{
        if(isLogged){       
            const newaddressdata = []
            stores.map((address) =>{
                    axios.get(`http://localhost:3000/geocoding/v5/mapbox.places/${address.DiaChi}.json?access_token=pk.eyJ1IjoiaHV5bmhnYW0iLCJhIjoiY2wzMnN2NnFsMDE4eTNjcXNhNGkzMDN1cSJ9.vOKEhsdbiVsP9l4XdvFIpA`)
                    .then(function (response) {
                    // handle success              
                    newaddressdata.push({
                        ...address,
                        longitude: response.data.features[0].center[0],
                        latitude: response.data.features[0].center[1],
                    });
                    })
                    .catch(function (error) {
                    // handle error
                    console.log(error);
                    })  
                    setAddressMaker(newaddressdata);      
            })
            return fetchStore(id).then(res =>{
                dispatch(dispatchGetStore(res));
            }) 
            return fetchRate(id).then(res =>{
                dispatch(dispatchGetRate(res));
            }) 
        }
    }, [id, isLogged, dispatch, callback])

    useEffect(() =>{
        if(isLogged){       
            return fetchRate(id).then(res =>{
                dispatch(dispatchGetRate(res));
            }) 
        }
    }, [id, isLogged, dispatch, callback])
     
    const [viewport, setViewPort] = React.useState({
        width: "96vw",
        height: "80vh",
        latitude: 10.046225,
        longitude: 105.7657688,
        zoom: 12
    })

// tính điểm đánh giá trung bình (5 sao)
    const Starpoint = rating.map(rate=> {
        const point = rate.Sao 
        return point
    })

    const sumStar = Starpoint.reduce((acc, curr) => acc + curr, 0)/rating.length
 
return (
    <div id="wrapper">  
        <div id="content-wrapper">  
            <Header />
                <div id="content">
                    {
                        stores.map((info =>
                            info.TrangThai === 1 ?
                            <>
                                <Typography sx={{marginTop:18, marginLeft:10}} variant="h4">{[info.TenCH]}</Typography>
                                <Rating sx={{marginLeft:10}} value={sumStar} readOnly />
                                <Typography sx={{marginTop:2, marginLeft:12, fontSize: 18}}>Địa chỉ: {[info.DiaChi]}</Typography>
                                <Typography sx={{marginLeft:12, fontSize: 18}}>Số điện thoại: {[info.SDT]}</Typography>
                                <Typography sx={{marginLeft:12, fontSize: 18}}>Còn kinh doanh</Typography>                               
                                {/* Tab */}
                                <Box sx={{ marginTop:3, width: '100%' }}>
                                    <Box sx={{ borderBottom: 1, borderColor: '#FFB30E' }}>
                                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered>
                                            <Tab label="Món ăn" {...a11yProps(0)} />
                                            <Tab label="Địa chỉ" {...a11yProps(1)} />
                                            <Tab label= {`Đánh giá (${rating.length})`} {...a11yProps(2)} />
                                        </Tabs>
                                    </Box>
{/*Tab món ăn*/}                                    
                                    <TabPanel value={value} index={0}> 
                                        <Grid container spacing={2} sx = {{marginLeft:2, marginTop:3}}> 
                                            {
                                                info.menu.map(menu =>
                                                <Grid item md={3}>
                                                    <Box
                                                            sx={{
                                                                bgcolor: 'background.paper',
                                                                boxShadow: 1,
                                                                borderRadius: 4,
                                                                p: 1,
                                                                width: 345,
                                                                height: 450,
                                                                marginBlockEnd:'120px',
                                                                
                                                            }}
                                                    >
                                                        <Box>
                                                            <img src = {menu.HinhAnh}   width = {327} height = {218} className="rounded" ></img>
                                                            <Typography sx={{fontSize: 20, alignItems: "Left"}}>{menu.TenMonAn}</Typography>
                                                {/* Trạng thái = 1: còn món, Trạng thái != 1: hết món */}
                                                            {menu.TrangThai === 1 ? <span className="badge badge-secondary">Còn món </span>: <span className ="badge badge-pill badge-danger">Hết món</span>}
                                                            {menu.SoLuongCon <= 10 && menu.SoLuongCon > 0 ? <span className="badge badge-pill badge-danger">Còn {menu.SoLuongCon} phần </span>: ""}
                                                            <Typography  sx={{fontSize: 17, alignItems: "Left" }}>{menu.GiaBan.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</Typography>
                                                            <Typography  sx={{fontSize: 17, alignItems: "Left" }}>Mô tả:</Typography>
                                                            <Typography  sx={{fontSize: 17, alignItems: "Left"}}>{menu.MoTa}</Typography>
                                                            <Box sx={{ '& button': { margin: 2} }}>
                                                                {
                                                                    menu.TrangThai === 1  ? // 1: Còn món, != 1: Hết món (disabled button )
                                                                    <>
                                                                    <Button sx ={{backgroundColor: '#FFB30E'}} variant="contained" size="medium"onClick= {
                                                                        async e => {
                                                                            try {
                                                                                await axios.post("http://localhost:5000/store/add_cart", {
                                                                                    id_Email: role._id,
                                                                                    id_MonAn: menu._id,
                                                                                    SoLuong: 1                                                         
                                                                                });
                                                                                alert('Thao tác thành công')
                                                                                setTimeout(() => {
                                                                                    window.location.href = `/cart/${role._id}`
                                                                                }, 500);   
                                                                            } catch (err) {
                                                                                alert(err)
                                                                            }
                                                                            }
                                                                    }>
                                                                            Mua ngay 
                                                                    </Button>
                                                                        <Button sx ={{backgroundColor: '#FFB30E'}} variant="contained" size="medium" onClick= {
                                                                            async e => {
                                                                                try {
                                                                                    await axios.post("http://localhost:5000/store/add_cart", {
                                                                                        id_Email: role._id,
                                                                                        id_MonAn: menu._id,
                                                                                        SoLuong: 1                                                         
                                                                                    });
                                                                                    alert('Thao tác thành công')   
                                                                                } catch (err) {
                                                                                    alert(err)
                                                                                }
                                                                                }
                                                                        }>
                                                                            Thêm giỏ hàng
                                                                        </Button>
                                                                    </> : 
                                                                    <>
                                                                        <Button disabled sx ={{backgroundColor: '#FFB30E'}} variant="contained" size="medium">
                                                                            Mua ngay 
                                                                        </Button>
                                                                        <Button  disabled sx ={{backgroundColor: '#FFB30E'}} variant="contained"  size="medium">
                                                                            Thêm giỏ hàng
                                                                        </Button>
                                                                    </>
                                                                }                                    
                                                            </Box>
                                                        </Box>                             
                                                    </Box>
                                                </Grid>
                                                )
                                            }
                                       </Grid>
                                    </TabPanel>
{/*Tab map*/}
                                    <TabPanel value={value} index={1}>  
                                   
                                        <ReactMapGL 
                                            {...viewport}
                                            mapStyle = "mapbox://styles/mapbox/streets-v11"
                                            mapboxApiAccessToken = {process.env.REACT_APP_MAPBOX_TOKEN}
                                            onViewportChange = {viewport => {
                                                setViewPort(viewport);
                                            }}
                                        >   
                                        {
                                            addressMaker.map((addressM) => (
                                                <>
                                                    <Marker
                                                        latitude={addressM.latitude}
                                                        longitude={addressM.longitude}
                                                        offsetLeft={-20}
                                                        offsetTop={-30}
                                                    >
                                                        <img
                                                        onClick={() => togglePopup(true)}
                                                        style={{ height: 50, width: 50 }}
                                                        src="https://xuonginthanhpho.com/wp-content/uploads/2020/03/map-marker-icon.png"
                                                        />
                                                    </Marker>  
                                                </>
                                            ))
                                        }                             
                                        </ReactMapGL>
                                    </TabPanel>
{/*Tab đánh giá*/}
                                    <TabPanel value={value} index={2}>  
                                        <FormControl sx={{ marginLeft:25, width:380, marginBlock: 1}}>
                                            <InputLabel id="demo-simple-select-label">Món Ăn</InputLabel>
                                            <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            label="Món ăn"
                                            onChange={handleChangeSelect}
                                            value = {MonAn}
                                            >
                                            {
                                                info.menu.map(menu => (
                                                    <MenuItem value={menu.TenMonAn}>{menu.TenMonAn}</MenuItem>
                                                ))
                                            }
                                            </Select>
                                        </FormControl>
                                        <Rating
                                            sx ={{marginLeft: 2, marginTop:2.5, fontSize:30}}
                                            value={Sao}
                                            onChange={handleChangeRating}
                                        /> 
                                        <TextField
                                            id="outlined-multiline-static"
                                            label="Đánh giá của bạn"
                                            onChange={handleChangeText}
                                            multiline
                                            rows={4}
                                            sx={{width: 1200, marginLeft:25}}
                                        />
                                       <Button sx ={{backgroundColor: '#FFB30E', marginTop:3, marginLeft: 160, marginBlockEnd:5}} variant="contained" size="large" onClick={
                                           async e => {
                                            try {
                                                await axios.post("http://localhost:5000/store/add_rate", {
                                                    id_CH: id, 
                                                    MonAn: MonAn, 
                                                    Sao: Sao, 
                                                    DanhGia: DanhGia, 
                                                    Email_DG: role.Email
                                                });
                                                
                                                alert('Gửi bài đánh giá thành công')   
                                            } catch (err) {
                                                alert(err)
                                            }
                                       }}>
                                            Gửi đánh giá 
                                        </Button>
                                    <Divider textAlign="left">Đánh giá khác</Divider> 
                                    {
                                        rating.map(rate => (
                                            <Grid
                                                sx = {{marginLeft: 15, marginBlockStart: 5}}
                                                container
                                                direction="column"
                                                justifyContent="space-between"
                                                alignItems="stretch"
                                            >
                                                <Box
                                                    sx={{
                                                            bgcolor: 'background.paper',
                                                            boxShadow: 1,
                                                            borderRadius: 4,
                                                            p: 2,
                                                            width: 1020,
                                                            maxheight: 150,
                                                            marginBlockEnd:'10px',
                                                                
                                                    }}
                                                >
                                                <Typography sx={{fontSize: 14}}>{rate.Email_DG} - {rate.TenMonAn}</Typography>
                                                <Rating
                                                    sx ={{fontSize:25}}
                                                    value={rate.Sao}
                                                    readOnly
                                                /> 
                                                <Typography>{rate.DanhGia}</Typography>
                                                </Box>
                                            </Grid>
                                        ))
                                    }
                                    
                                    </TabPanel>
                                </Box>
                            </> : 
                            <>
                                <Typography sx={{marginTop:18, marginLeft:10}} variant="h4">{[info.TenCH]}</Typography>
                                <Typography sx={{marginTop:2, marginLeft:12, fontSize: 18}}>Địa chỉ: {[info.DiaChi]}</Typography>
                                <Typography sx={{marginLeft:12, fontSize: 18}}>Số điện thoại: {[info.SDT]}</Typography>
                                <Typography sx={{marginLeft:12, fontSize: 18, color: '#ff3d00'}}>Ngừng kinh doanh</Typography>     
                                <Box sx={{ marginTop:3, width: '100%' }}>
                                    <Box sx={{ borderBottom: 1, borderColor: '#FFB30E' }}>
                                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered>
                                            <Tab label="Món ăn" {...a11yProps(0)} />
                                            <Tab label="Thông tin" {...a11yProps(1)} />
                                            <Tab label="Đánh giá" {...a11yProps(2)} />
                                        </Tabs>
                                    </Box>
                                    <TabPanel value={value} index={0}> {/*Tab món ăn*/}
                                       Các món ăn sẽ không hiển thị do quán đã ngững kinh doanh
                                    </TabPanel>
                                </Box>                          
                            </>
                            ))                        
                    }                                                      
                </div>
            <Footer/> 
        </div>
    </div>
  );
}
