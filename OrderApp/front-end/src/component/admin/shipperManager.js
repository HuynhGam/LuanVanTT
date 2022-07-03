import React, {useEffect, useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux'
import {fetchShipper, dispatchGetShipper} from '../../redux/actions/shipperAction'
import Sidebar from './sidebar';
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import {Typography} from '@mui/material';


export default function Shipper() {

    const auth = useSelector(state => state.auth); 
    const {isAdmin} = auth;

    const shippers = useSelector(state => state.shippers);

    const history = useHistory();
    const token = useSelector(state => state.token);

    const [callback] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if(isAdmin){
            return fetchShipper().then(res =>{
                dispatch(dispatchGetShipper(res));
            })
        }
    },[token, isAdmin, dispatch, callback])

    const columns = [
        {
          name: "Họ Tên",
          selector: "name",
          sortable: true,
          width: "180px"
          
        },
        {
            name:"",
            selector: "sex",
            width: "80px"
          },
        {
          name: "Email",
          selector: "email",
          width: "180px"
        },
        {
          name: "SDT",
          selector: "phone",
          width: "110px"
          
        },
        {
            name: "Nơi ở",
            selector: "home",
            width: '260px'
            
          },
        {
          name:"",
          selector: "status",
          width: '100px'
            
        },
        {
            name: "",
            selector: "reset",
            width: '110px'
        },
        {
            name: "",
            selector: "edit",
            width: '170px'
        }
      ];

      const data = shippers.map(shipper =>(
          {
            name: shipper.HoTen,
            sex: shipper.GioiTinh === 1 ? 'Nữ' : 'Nam',
            email: shipper.Email,
            phone: shipper.SDT,
            home: shipper.DiaChi,
            status: shipper.TrangThai ===1 ? 'Hoạt động' : 'Đã khóa',
            reset: <Link className="btn btn-white shadow-warning text-warning" onClick={
                                    async e => {
                                        try {
                                            await axios.patch(`http://localhost:5000/user/password_shipper/${shipper.Email}`)
                                            alert('Thao tác thành công') 
                                        } catch (err) {
                                            alert(err)
                                        }
                                    
                                    }        
                                }
                    > Reset </Link>,
            edit: <Link to = {`/update_shipper/${shipper._id}`} className="btn btn-white shadow-warning text-warning">Chỉnh sửa</Link> 
          }
      ))

        const tableData = {
        columns,
        data
        };


  return (
    <>
        <div id="app">
            <div id="sidebar" class="active">
                <Sidebar/>
            </div>

            <div id="main">     
                <div class="page-content">
                    <div className="page-heading pb-2 mt-4 mb-2 ">
                        <h3>Tài khoản của người giao hàng</h3>
                    </div>
                    <IconButton aria-label="delete" sx ={{ marginLeft: 130, marginTop:-12, marginBlockEnd: -8}} onClick ={()=> history.push('/add_shipper')}>
                        <AddIcon/>
                    </IconButton>
                    <div class="table-responsive">          
                         <DataTableExtensions {...tableData}>
                            <DataTable
                            columns={columns}
                            data={data}
                            noHeader
                            defaultSortAsc={false}
                            pagination
                            highlightOnHover
                            />
                        </DataTableExtensions>  
                    </div>
                </div>
            </div>
        </div>
    </>
  );
}
