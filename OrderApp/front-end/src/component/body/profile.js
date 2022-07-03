import {React,  useState } from 'react';
import axios from 'axios';
import Header from '../header'
import Footer from '../footer'
import { useHistory} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { showErrMsg, showSuccessMsg} from '../unitl/notification/notification';
import { Grid, Paper, Button, TextField, Typography} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';


const paperStyle = {padding: 25, height: '62vh', width: 450, margin: "120px auto"}
const btstyle = {margin:'8px 0'}

export default function Profile_User() {

    const auth = useSelector(state => state.auth);
    const {user, role} = auth;

    const token = useSelector(state => state.token);
    const [loading, setLoading] = useState(false);

    const initiaiState = {
        Ten: '',
        SDT: '',
        err: '',
        success: ''
    };
    const [data, setData] = useState(initiaiState);

    const handleChange = e => {
        const {name, value} = e.target;
        setData({...data, [name]:value, err:'', success:''});

      };

      const {Ten, SDT, err, success} = data;

      const handleSubmit = async e => {
        e.preventDefault(); 
        setLoading(true)
            try {
                const res = await axios.patch(`http://localhost:5000/user/update_info/${user._id}`, {
                    Ten: Ten ? Ten: user.Ten, 
                    SDT: SDT ? SDT: user.SDT
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
            {/* Page Wrapper */}
            <div id="wrapper">
                {/* End of Sidebar */}
                {/* Content Wrapper */}
                <div id="content-wrapper" className="d-flex flex-column">
                     <Header/>
                {/* Main Content */}
                <div id="content">
                    {/* Begin Page Content */}
                    <div className="container-fluid">
                        {/* Page Heading */}
                        <Paper  elevation = {10} style = {paperStyle}>
                    <Grid align = 'center'>
                        <h2>Thông tin cá nhân của bạn</h2>       
                        <TextField                          
                            required
                            id="outlined-textarea"
                            label="Họ tên"
                            name = 'Ten'
                            defaultValue={user.Ten}
                            onChange={handleChange}
                            sx={{ m: 2, width: '39ch' }}
                        />
                          <TextField
                            required
                            id="outlined-textarea"
                            label="Email"
                            name = 'Email'
                            defaultValue = {role.Email}
                            disabled
                            sx={{ m: 2, width: '39ch' }}
                        />
                        <TextField
                            required
                            id="outlined-textarea"
                            label="Số điện thoại"
                            type = "number"
                            name = 'SDT'
                            defaultValue = {user.SDT}
                            onChange={handleChange}
                            sx={{ m: 2, width: '39ch' }}
                        />
                        {
                            loading ? <LoadingButton sx={{width: '45ch', margin:'8px 0' }} loading loadingIndicator="Đang xử lý..." variant="outlined">Fetch data</LoadingButton>
                                    : <Button type = 'submit' color = 'primary' onClick={handleSubmit} sx={{width: '45ch' }} variant='contained' style ={btstyle}> Cập nhật</Button>
                        }       
                        <Typography>{err && showErrMsg(err)} </Typography>
                        <Typography>{success && showSuccessMsg(success)}</Typography>
                      
                    </Grid>
                </Paper>  
                    </div>
                    {/* /.container-fluid */}
                </div>
                {/* End of Main Content */}
                {/* Footer */}
                <Footer/>
                {/* End of Footer */}
                </div>
                {/* End of Content Wrapper */}
            </div>
            {/* End of Page Wrapper */}
            {/* Scroll to Top Button*/}
            <a className="scroll-to-top rounded" href="#page-top">
                <i className="fas fa-angle-up" />
            </a>
    </>
  );
}
