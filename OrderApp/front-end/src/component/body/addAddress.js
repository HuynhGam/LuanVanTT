import {React,  useState } from 'react';
import axios from 'axios';
import Header from '../header'
import Footer from '../footer'
import {useParams} from 'react-router-dom';
import { showErrMsg, showSuccessMsg} from '../unitl/notification/notification';
import { Grid, Paper, Button, TextField} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

export default function AddAddress() {
    const paperStyle = {padding: 25, height: '48vh', width: 680, margin: "150px auto"};
    const btstyle = {margin:'8px 0'};
    const {id} = useParams();
    const [loading, setLoading] = useState(false);

    const initiaiState = {
        id_KH: '',
        SoNha: '',
        DiaChi: '',
        err: '',
        success: '',
    }
    const [address, setAddress] = useState(initiaiState);

    const handleChange = e => {
        const {name, value} = e.target;
        setAddress({...address, [name]:value, err:'', success:''});

      };
    const {SoNha, DiaChi, err, success} = address;

    const handleSubmit = async e => {
        e.preventDefault(); 
        setLoading(true)     
        // Gọi API bên back-end
        try {
            const res = await axios.post("http://localhost:5000/address/add_address", {
                id_KH: id, SoNha, DiaChi
            });
            setAddress({...address, err:'', success: res.data.msg});
            setLoading(false) 
          } catch (err) {
              err.response.data.msg && 
              setAddress({...address, err: err.response.data.msg, success: ''});
              setLoading(false) 
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
                        <Paper elevation = {10} style = {paperStyle}>
                    <Grid align = 'center'>
                        <h2>Thêm địa chỉ của bạn</h2>       
                        <TextField
                            id="outlined-textarea"
                            label="Số nhà (không bắt buộc)"
                            name = 'SoNha'
                            sx={{ m: 2, width: '65ch' }}
                            onChange={handleChange}
                        />
                        <TextField
                            required
                            id="outlined-multiline-flexible"
                            label="Địa chỉ"
                            name="DiaChi"
                            multiline
                            maxRows={4}
                            sx={{ m: 2, width: '65ch' }}
                            onChange={handleChange}
                        />
                        {
                            loading ? <LoadingButton sx={{width: '40ch' }} loading loadingIndicator="Đang xử lý..." variant="outlined">Fetch data</LoadingButton>
                                    : <Button type = 'submit' color = 'primary' onClick={handleSubmit} sx={{width: '41ch' }} variant='contained' style ={btstyle}>Thêm</Button>
                        }  
                    {err && showErrMsg(err)}
                    {success && showSuccessMsg(success)}
                    </Grid>
                </Paper> 
                {/* <Button variant="contained" size="large" onClick= {history.push(`/address/${info._id}`)}>Quay lại </Button> */}

                        <div className="d-sm-flex align-items-center justify-content-between mb-4">
                        </div>  
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
