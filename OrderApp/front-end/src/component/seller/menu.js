import React, {useEffect, useState} from 'react';
import { useHistory, useParams, Link } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux'
import Sidebar from '../seller/sidebar'
import {fetchMenu, dispatchGetMenu} from '../../redux/actions/menuAction';
import {Grid, Paper, Box, Typography, Button, Rating} from '@mui/material';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {fetchRate, dispatchGetRate} from '../../redux/actions/rateAction';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';

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



export default function Menu() {
      // TabPanel
    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
      };
      // TabPanel
 
    const {id} = useParams();
    const history = useHistory();

    const auth = useSelector(state => state.auth);
    const menu = useSelector(state => state.menu);
    const stores = useSelector(state => state.stores);
    const rating = useSelector(state => state.rating);

    const {role, isLogged, isSeller} = auth

    const [callback] = useState(false);
    const dispatch = useDispatch();

    const [inforStore, setInforStore] = useState([]);

    useEffect(() => {
        if(stores.length !== 0){
            stores.forEach(store => {
                if(store._id === id){
                    setInforStore(store);
                }
            })
        }else{
            history.push('/store');
        }
    },[stores, id, history])

// Lấy tất cả menu qua bên redux
    useEffect(() => {
        if(isSeller){
            return fetchMenu(id).then(res =>{
                dispatch(dispatchGetMenu(res));
            })
        }
    },[id, isSeller, dispatch, callback])

    useEffect(() =>{
        if(isLogged){       
            return fetchRate(id).then(res =>{
                dispatch(dispatchGetRate(res));
            }) 
        }
    }, [id, isLogged, dispatch, callback])

// tính điểm đánh giá trung bình (5 sao)
    const Starpoint = rating.map(rate=> {
        const point = rate.Sao 
        return point
    })

    const sumStar = Starpoint.reduce((acc, curr) => acc + curr, 0)/rating.length
  
    
   
  return (  
    <>
        <div id="app">
            <div id="sidebar" class="active">
                <Sidebar/>
            </div>

            <div id="main">     
                <div class="page-content">
                <Typography sx={{marginTop:5, marginLeft:10}} variant="h4">{[inforStore.TenCH]}</Typography>
                {/* <IconButton sx ={{marginTop: -7, marginLeft: 4}} onClick={() => history.push(`/update-store/${inforStore._id}`)} size="small" aria-label="delete"><EditIcon /></IconButton> */}
                <Typography sx={{marginLeft:12, fontSize:18, fontWeight: 600}}> Số điện thoại: {[inforStore.SDT]}</Typography>
                <Typography sx={{marginLeft:12, fontSize: 18, fontWeight: 600, marginBlockEnd:1}}> Địa chỉ: {[inforStore.DiaChi]}</Typography>
                <Rating sx={{marginLeft:12}} value={sumStar} readOnly />
                

                {
                    inforStore.TrangThai === 1 ? (
                      <>
                        <Box sx={{ marginTop:3, width: '100%' }}>
                            <Box sx={{ borderBottom: 1, borderColor: '#FFB30E' }}>
                            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered>
                                <Tab label="Món ăn" {...a11yProps(0)} />
                                <Tab label= {`Đánh giá (${rating.length})`} {...a11yProps(2)} />
                            </Tabs>
                            </Box>
                        </Box>
                        <TabPanel value={value} index={0}>
                        <>
                            <div className="d-sm-flex align-items-center justify-content-between mb-6">
                                <Link to= {`/add-menu/${id}`} className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"> Thêm món ăn</Link>
                            </div>
                
                            <Grid container spacing={2} sx = {{marginLeft:2, marginTop:3}}>   
                                {
                                    menu.map(menu_store => 
                                    <Grid item md={4}>
                                    <Box
                                        sx={{
                                        bgcolor: 'background.paper',
                                        boxShadow: 1,
                                        borderRadius: 4,
                                        p: 1,
                                        width: 320,
                                        height: 450,
                                        marginBlockEnd:'120px'                   
                                        }}
                                    >
                                        <Box>
                                            <img src = {menu_store.HinhAnh} width = {303} height = {218} className="rounded" ></img>
                                            <Typography sx={{fontSize: 20, alignItems: "Left"}}>{menu_store.TenMonAn}</Typography>
                                            {menu_store.TrangThai === 1 ? <span className="badge badge-secondary">Còn món</span>: <span className ="badge badge-pill badge-danger">Hết món</span>}
                                            <Typography  sx={{fontSize: 17, alignItems: "Left" }}>  {menu_store.GiaBan.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</Typography>
                                            <Typography  sx={{fontSize: 17, alignItems: "Left" }}>Mô tả:</Typography>
                                            <Typography  sx={{fontSize: 17, alignItems: "Left"}}>{menu_store.MoTa}</Typography>
                                            <Box sx={{ '& button': { margin: 2 } }}>
                                                <>
                                                    <Button onClick={() => history.push(`/update-menu/${menu_store._id}`)} sx ={{backgroundColor: '#FFB30E'}} variant="contained"  size="medium">
                                                        Chỉnh sửa
                                                    </Button>                                                                                                                                          
                                                </>
                                            </Box>
                                        </Box>                           
                                    </Box>
                                    </Grid>   
                                )}                 
                            </Grid>  
                        </>
                        </TabPanel>
                            <TabPanel value={value} index={1}>
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
                      </>
                    ) : (
                     <Typography></Typography>
                    )
                }             
                </div>
            </div>
        </div>
    </>
  );
}
