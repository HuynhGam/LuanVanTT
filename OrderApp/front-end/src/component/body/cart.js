import React, {useEffect, useState} from 'react';
import { useHistory, useParams, Link} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import {fetchCart, dispatchGetCart} from '../../redux/actions/cartAction';
import Header from '../header';
import Footer from '../footer';
import {Alert, TableHead, Paper, TableRow, TableContainer, TableCell, TableBody, Table, Accordion, AccordionSummary, AccordionDetails, Typography, ListItem, ListItemAvatar, List, Button, ListItemText, DialogTitle, Dialog} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import PropTypes from 'prop-types';
import ReactLoading from 'react-loading';
import calcCrow from './calcCrowKM';
import IconButton from '@mui/material/IconButton';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { orange } from '@mui/material/colors';

export default function Cart() {

  const {id} = useParams();
  const address = useSelector(state => state.address);
 
  const auth = useSelector(state => state.auth); // Lấy từ react-redux
  const cart = useSelector(state => state.cart); // Lấy từ react-redux
 
  const { isLogged, user, role } = auth; // Lấy từ react-redux
  const id_user = user._id //Lấy id của người dùng

  const [callback] = useState(false);
  const dispatch = useDispatch();
 
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState([]); // Tạo mảng rỗng 

  const [SoLuong, setSoLuong]= useState(1);
  const history = useHistory();

  const [loading, setLoading] = React.useState(false);
  const [warning, setWarning] = React.useState(false);
  const [text, setText] = React.useState('');

  const [addressFrom, setAddressFrom] = React.useState([]);
  const [addressTo, setAddressTo] = React.useState([]);

// Mảng để lưu địa chỉ khi có 2 món cùng một quán
  const duplicateAds = cart.map(v => v.DiaChi).filter((v, i, vAds) => vAds.indexOf(v) == i);

// Mở danh sách
  const handleClickOpen = () => {
    setOpen(true);
  };
// Đóng danh sách và lấy địa chỉ đã chọn gán vào mảng
  const handleClose = (value) => {
    setOpen(false);
    setSelectedValue(value);
  };


  function SimpleDialog(props) {
    const { onClose, selectedValue, open } = props;


  // Lấy tọa độ địa chỉ nhận hàng 
  function getCoordinatesTo(value){
          axios.get(`http://localhost:3000/geocoding/v5/mapbox.places/${value}.json?access_token=pk.eyJ1IjoiaHV5bmhnYW0iLCJhIjoiY2wzMnN2NnFsMDE4eTNjcXNhNGkzMDN1cSJ9.vOKEhsdbiVsP9l4XdvFIpA`)
          .then(function (response) {
          // handle success   
          const newaddressdata1 = []          
          newaddressdata1.push({
              longitude: response.data.features[0].center[0],
              latitude: response.data.features[0].center[1],
          });
          setAddressTo(newaddressdata1);
          })
          .catch(function (error) {
          // handle error
          console.log(error);
          })   
  }

  // Lấy tọa độ địa chỉ giao hàng
  function getCoordinatesFrom(){
          // Lấy tọa độ giao hàng
          const newaddressdata2 = []
          duplicateAds.map((address) =>{
                  axios.get(`http://localhost:3000/geocoding/v5/mapbox.places/${address}.json?access_token=pk.eyJ1IjoiaHV5bmhnYW0iLCJhIjoiY2wzMnN2NnFsMDE4eTNjcXNhNGkzMDN1cSJ9.vOKEhsdbiVsP9l4XdvFIpA`)
                  .then(function (response) {
                    // handle success              
                    newaddressdata2.push({
                        longitude: response.data.features[0].center[0],
                        latitude: response.data.features[0].center[1],
                    });
                
                  })
                  .catch(function (error) {
                  // handle error
                  console.log(error);
                  })  
                  setAddressFrom(newaddressdata2);   
    })
  }

  const handleListItemClick = (value) => {
    getCoordinatesFrom(); // Giao hàng
    onClose(value);  
    getCoordinatesTo(value); // Nhận hàng     
  };

  const handleClose = () => {
    onClose(selectedValue);
       
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Chọn địa chỉ bạn muốn giao tới</DialogTitle>
      <List sx={{ pt: 0 }}>
      {/* Hiển thị list địa chỉ lấy được bên react redux */}
        {address.map(addres => (
          <ListItem button onClick={() => handleListItemClick(`${addres.SoNha}`+` ${addres.DiaChi}`)} key={addres._id}>
            <ListItemAvatar>
              <FmdGoodIcon>
                <PersonIcon />
              </FmdGoodIcon>
            </ListItemAvatar>
            <ListItemText primary={`${addres.SoNha}`+` ${addres.DiaChi}`}  />  {/* Số nhà + địa chỉ */}
          </ListItem>
        ))}
        <ListItem autoFocus button onClick={() => history.push(`/addAddress/${id_user}`)}>
          <ListItemAvatar>
            <AddIcon />
          </ListItemAvatar>
          <ListItemText primary="Thêm địa chỉ khác" />
        </ListItem>
      </List>
    </Dialog>
  );

}

  SimpleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedValue: PropTypes.string.isRequired,
  };

  const ChangeSoLuong = e => {
        const value = e.target.value
        setSoLuong(value);
    }

  useEffect(() => {
        if(isLogged === true){
            return fetchCart(id).then(res =>{
                dispatch(dispatchGetCart(res));
            })   
            
    }},[isLogged, dispatch, callback])


// Tính tổng tiền trong giỏ hàng
    const totalData = cart.map((item) => {
                const total = item.GiaBan * item.SoLuong
                return total
        })

// TÍnh tổng cộng phí thanh toán trong giỏ hàng
    const totalFee = totalData.reduce((acc, curr) => acc + curr,0)

// Tính phí ship  
    const shipFee = addressFrom.map(from => {
              const fee = (calcCrow(from.latitude, from.longitude, addressTo[0].latitude, addressTo[0].longitude)).toFixed(0) * 10000
              return fee
            })

// Tổng tiền + phí ship  
    const payment = totalData.reduce((acc, curr) => acc + curr,0) + shipFee.reduce((acc, curr) => acc + curr,0)
    console.log(payment, shipFee, totalFee)

// Tính km để kiểm tra
    const km = addressFrom.map(from => (calcCrow(from.latitude, from.longitude, addressTo[0].latitude, addressTo[0].longitude)).toFixed(1))

// Kiểm tra số lượng trong giỏ hàng và số lượng còn của món ăn
    const checkQuality = cart.map(item => {
      if(item.SoLuong > item.SoLuongCon)
      {
        return false
      }
      else{
        return true
      }
    })

// Xử lý nút thanh toán
    const handlePayment = () => {  
      if(!addressTo[0]) // Nếu chưa chọn địa chỉ
      {
          setWarning(true);
          setText('Vui lòng chọn địa chỉ nhận hàng của bạn')

      } 
      // Nếu địa chỉ lớn hơn 5km
      else if(km > 5.0){
        setWarning(true);
        setText('Phạm vi để giao hàng không quá 5km. Vui lòng thử lại')
        }
      else if(duplicateAds.length > 1)
      {
        setWarning(true);
        setText('Vì để giao đến bạn nhanh nhất có thể. Nên chúng tôi chỉ nhận đơn khi bạn đặt một cửa hàng')
      }
      else{
          try {  
              const id = cart[0].id_GH;
              const id_CH = cart[0].id_CH;
              if(checkQuality.includes(false)){
                setText('Số lượng món ăn hiện tại không đủ với số lượng bạn yêu cầu. Vui lòng thử lại')
                setWarning(true);
              }  
              else{
                  axios.post("http://localhost:5000/store/add_oder",{
                    id_DH : id,
                    id_CH: id_CH,
                    Email: role.Email,
                    ThanhToan: totalFee,
                    PhiShip: shipFee[0],
                    TongCong: payment,
                    DiaChi: selectedValue
                }); 
                for (var i = 0; i < cart.length; i++) {
                    axios.post("http://localhost:5000/store/add_detail",{
                      id_DH: id,
                      GiaBan: cart[i].GiaBan,
                      id_MonAn: cart[i]._id,
                      SoLuong: cart[i].SoLuong,
                    })
                } 
                alert('Thao tác thành công')
                window.location.href = `/your_order/${role.Email}`  
              } 
          } catch (err) {
            alert("Giỏ hàng của bạn đang trống. Hãy tìm món ăn và quay trở lại nhé")
          }
        }
        }
     
  return (
    <>
        <div id="content-wrapper">    
            <Header />
        </div>
        {/* Block content - Đục lỗ trên giao diện bố cục chung, đặt tên là `content` */}
        <div className="container mt-4">      
          <Typography variant="h4" sx={{marginLeft: 70, marginTop:14, marginBlockEnd: 3 }}>GIỎ HÀNG CỦA BẠN</Typography>
            {
              warning ? <Alert sx= {{marginBlockEnd: 2}} severity="warning">{text}</Alert> : <></>
            }
      {/*Loanding */}
                      {loading ?  
                            <ReactLoading type='spin' color='#000000' style = {{marginLeft: 680, marginTop: 50 , height: 150, width: 80}} /> 
                            : 
                            <div className="row">
                          {/* Table */}
                                <div>
                                  <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                      <TableHead>
                                        <TableRow>
                                          <TableCell style={{ fontWeight: 600 }}></TableCell>
                                          <TableCell style={{ fontWeight: 600 }}>Món ăn</TableCell>
                                          <TableCell style={{ fontWeight: 600 }} align="right">Giá</TableCell>
                                          <TableCell style={{ fontWeight: 600, width: 120 }} align="right">Số lượng</TableCell>
                                          <TableCell style={{ fontWeight: 600 }} align="right">Thành tiền</TableCell>
                                          <TableCell style={{ fontWeight: 600 }} align="right"></TableCell>
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                          {cart.map(item => (
                                            <>
                                            <TableRow>
                                              <TableCell component="th" scope="row">
                                                <Typography><Link to ={`/infor_store/${item.id_CH}`} className='text-primary'>{item.TenCH}</Link> </Typography>
                                              </TableCell>
                                              <TableCell component="th" scope="row">
                                                <Typography>{item.TenMonAn} {item.SoLuongCon <= 10 ? <span className="badge badge-pill badge-danger">Còn {item.SoLuongCon} món </span>: ""}</Typography>
                                              </TableCell>
                                              <TableCell align="right"><Typography>{item.GiaBan.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</Typography></TableCell>
                                              <TableCell align="right">
                                                <Typography>
                                                  <input style={{width: '55%'}} defaultValue={item.SoLuong}  min = '1' type = "number" onChange={ChangeSoLuong}></input>
                                                  <IconButton sx= {{marginTop: -0.5}} size="small">
                                                    <CheckBoxIcon sx={{ color: orange[500] }} fontSize="small" onClick= {
                                                        async e => {
                                                                try {
                                                                      await axios.patch(`http://localhost:5000/store/update/${item.id_GH}`, {SoLuong: SoLuong})
                                                                      window.location.reload();
                                                                    } catch (err) {
                                                                      alert(err)
                                                                      }  
                                                                    }} />
                                                  </IconButton >
                                                </Typography>
                                              </TableCell>
                                              <TableCell align="right"><Typography>{(item.SoLuong * item.GiaBan).toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</Typography></TableCell>
                                              <TableCell align='center'>
                                                <button id="delete_1" data-sp-ma={2} className="btn btn-white shadow-warning text-warning" onClick={
                                                          async e => {
                                                              try {
                                                                  await axios.patch(`http://localhost:5000/store/remove_food/${item.id_GH}`)
                                                                  alert('Thao tác thành công') 
                                                                  setLoading(true)  
                                                                  window.location.reload(); 
                                                              } catch (err) {
                                                                  alert(err)
                                                              }
                                                          
                                                          }        
                                                    }>
                                                        <i className="fa fa-trash" aria-hidden="true" /> Xóa
                                                </button>
                                              </TableCell>
                                              </TableRow>
                                            </>
                                          ))}
                                      </TableBody>
                                    </Table>
                                  </TableContainer>
                                </div>
                      {/* End Table */}

                                <div>  
                                  <TableContainer sx={{marginLeft: 1, marginTop:2}}>
                                            <Table sx={{width:650}} aria-label="simple table">
                                              <TableBody>
                                                <TableRow>
                                                  <TableCell><Typography sx={{fontWeight: 600}}>Từ: </Typography></TableCell>
                                                  <TableCell align="left">{duplicateAds.map((ad) => <Typography>{ad}</Typography>)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                  <TableCell><Typography sx={{fontWeight: 600}}>Đến: </Typography></TableCell>
                                                  <TableCell align="left"><Typography>{selectedValue}</Typography> </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                <TableCell><Typography sx={{fontWeight: 600}}>Phí: </Typography></TableCell>
                                                  <TableCell align="left">
                                                    
                                                  {addressFrom.map(from => 
                                                    <Typography>
                                                        {(calcCrow(from.latitude, from.longitude, addressTo[0].latitude, addressTo[0].longitude)).toFixed(1)} km 
                                                      ; {((calcCrow(from.latitude, from.longitude, addressTo[0].latitude, addressTo[0].longitude)).toFixed(0) * 10000).toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}
                                                    </Typography>
                                                  )}
                                                  </TableCell>
                                                </TableRow>
                                              </TableBody>
                                              </Table>
                                  </TableContainer>
          
                                  <TableContainer sx={{marginLeft: 138, marginTop: -21}}>
                                            <Table sx={{width:300}} aria-label="simple table">
                                              <TableBody>
                                                <TableRow>
                                                  <TableCell><Typography sx={{fontWeight: 600}}>Thanh toán</Typography></TableCell>
                                                  <TableCell align="right"><Typography>{totalFee.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</Typography></TableCell>
                                                </TableRow>
                                                <TableRow>
                                                  <TableCell><Typography sx={{fontWeight: 600}}>Phí giao hàng</Typography></TableCell>
                                                  <TableCell align="right"><Typography>{shipFee.reduce((acc, curr) => acc + curr,0).toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</Typography></TableCell>
                                                </TableRow>
                                                <TableRow>
                                                  <TableCell><Typography sx={{fontWeight: 600}}>Tổng cộng</Typography></TableCell>
                                                  <TableCell align="right"><Typography>{payment.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</Typography></TableCell>
                                                </TableRow>
                                              </TableBody>
                                              </Table>
                                  </TableContainer>

                                  <Accordion sx={{marginTop:2, marginBlockEnd:3}}>
                                            <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                            >
                                            <Typography style={{ fontWeight: 600 }}>Chọn địa chỉ nhận hàng</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                            <Typography>
                                            <Typography variant="subtitle1" component="div">
                                                Giao đến: {selectedValue}
                                            </Typography>
                                            <br />
                                            <Button variant="contained" sx ={{backgroundColor: '#FFB30E'}} onClick={handleClickOpen}>
                                                Địa chỉ khác
                                            </Button>
                                            <SimpleDialog
                                                selectedValue={selectedValue}
                                                open={open}
                                                onClose={handleClose}
                                            />
                                            </Typography>
                                            </AccordionDetails>
                                  </Accordion>
                                </div>
                                <Typography sx={{marginLeft: 1}}>
                                  Lưu ý: <br/>
                                  - Vì muốn món ăn đến tay bạn một cách nhanh nhất có thể thì chúng tôi<br/>
                                    sẽ chỉ giao các món ăn chung một cửa hàng. Để có thể đặt món tại cửa <br/>
                                    hàng khác thì bạn hãy hoàn tất việc đặt hàng tại cửa hàng hiện tại và <br/>
                                    thực hiện đặt hàng tại cửa hàng tiếp theo nhé.                
                                </Typography>  
                              <Button onClick={handlePayment} variant="contained" sx ={{width: 180, backgroundColor: '#FFB30E', marginLeft: 150, marginTop:-10, marginBlockEnd: 15}} size = "large"> Đặt hàng <ShoppingCartCheckoutIcon sx = {{marginLeft:1}}/> </Button>
                            </div>
                      }                          
        </div>
        {/* End block content */}
        <Footer/>
    </>
  );
}
