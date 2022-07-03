import React, {useEffect, useState} from 'react';
import { useHistory, useParams, Link } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux'
import axios from 'axios';
import Header from '../header'
import Footer from '../footer';
import {Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

import ReactLoading from 'react-loading';

export default function Address() {
    const history = useHistory();
    const address = useSelector(state => state.address);

    const {id} = useParams();
    const [loading, setLoading] = React.useState(false)

  
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
{/*Loanding */}     {loading ? 
                        <ReactLoading type='spin' color='#000000' style = {{marginLeft: 750, marginTop: 180 , height: 150, width: 80}} /> 
                        :
                        <Box sx = {{width: 1450, marginLeft: 13}}>
                            <TableContainer component={Paper} sx = {{marginTop: 15}}>
                            <Table sx={{ minWidth: 700, fontSize: 16 }} aria-label="simple table">
                                <TableHead>
                                <TableRow>
                                    <TableCell sx={{fontSize: 18}} align="left" width="400px">Địa chỉ</TableCell>                          
                                    <TableCell sx={{fontSize: 18}} align="center" width = "20px"></TableCell>    
                                    <TableCell sx={{fontSize: 18}} align="center" width = "20px"></TableCell>                               
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        address.map(user_address => (
                                            <TableRow key = {user_address._id}>
                                                <TableCell sx={{fontSize: 17}} align="left"> {user_address.SoNha} {user_address.DiaChi}</TableCell>
                                                <TableCell sx={{fontSize: 17}} align="center"><IconButton onClick={() => history.push(`/updateAddress/${user_address._id}`)} size="small" aria-label="delete"><EditIcon /></IconButton>  </TableCell>
                                                <TableCell sx={{fontSize: 17}} align="center"><IconButton aria-label="delete" onClick= {
                                                        async e => {
                                                                try {
                                                                        await axios.patch(`http://localhost:5000/address/remove_address/${user_address._id}`)
                                                                        alert('Thao tác thành công')
                                                                        setLoading(true)
                                                                        window.location.reload();
                                                                    } catch (err) {
                                                                        alert(err)
                                                                        }  
                                                                    }     
                                                                }><DeleteIcon /></IconButton> 
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            
                            </Table>
                            </TableContainer>

                            <Box sx={{ '& button': { m: 5}, marginLeft: 150 }}>
                                <Button variant="contained" sx = {{backgroundColor: '#FFB30E'}} onClick={() => history.push(`/addAddress/${id}`)} size="medium">
                                    Thêm địa chỉ mới
                                </Button>                    
                            </Box>
                        </Box>   
                    }          
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
