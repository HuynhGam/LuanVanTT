import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../header';
import Footer from '../footer';
import { useHistory, useParams} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { showErrMsg, showSuccessMsg} from '../unitl/notification/notification';
import { Grid, Paper, Button, TextField} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

const paperStyle = {padding: 25, height: '48vh', width: 680, margin: "150px auto"};
const btstyle = {margin:'8px 0'};

export default function AddAddress() {
    
    const history = useHistory();
    const [editAddress, setEditAddress] = useState([]);

    const {id} = useParams();
    const add = useSelector(state => state.address);

    const token = useSelector(state => state.token);
    const [loading, setLoading] = useState(false);

    const initiaiState = {
        SoNha: '',
        DiaChi: '',
        err: '',
        success: '',
    };
    const [address, setAddress] = useState(initiaiState);

    //Lấy thông tin dựa trên id
    useEffect(() => {
        if(add.length !== 0){
            add.forEach(ad => {
                if(ad._id === id){
                    setEditAddress(ad);
                }
            })
        }else{
            history.push(`/`);
        }
    },[add, id, history])

    const handleChange = e => {
        const {name, value} = e.target;
        setAddress({...address, [name]:value, err:'', success:''});

      };
    const {SoNha, DiaChi, err, success} = address;

    const handleSubmit = async e => {
        e.preventDefault(); 
        setLoading(true)
            try {
                const res = await axios.patch(`http://localhost:5000/address/update_address/${id}`, {
                    SoNha: SoNha ? SoNha: editAddress.SoNha, 
                    DiaChi: DiaChi ? DiaChi: editAddress.DiaChi
                },{
                    headers: {Authorization: token}
                })
               
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
                        <h2>Cập nhật địa chỉ của bạn</h2>   
                        <TextField
                            id="outlined-textarea"
                            label="Số nhà (không bắt buộc)"
                            name = 'SoNha'
                            key = {editAddress.SoNha}  
                            sx={{ m: 2, width: '65ch' }}
                            onChange={handleChange}
                            defaultValue = {editAddress.SoNha}                   
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
                            defaultValue= {editAddress.DiaChi}
                            key = {editAddress.DiaChi}
                        />  
                        {
                            loading ? <LoadingButton sx={{width: '40ch' }} loading loadingIndicator="Đang xử lý..." variant="outlined">Fetch data</LoadingButton>
                                    : <Button type = 'submit' color = 'primary' onClick={handleSubmit} sx={{width: '41ch' }} variant='contained' style ={btstyle}> Cập nhật</Button>
                        }  
                    {err && showErrMsg(err)}
                    {success && showSuccessMsg(success)}
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
