import React, {useEffect, useState} from 'react';
import { Link} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux'
import {fetchAllUsers, dispatchGetAllUsers} from '../../redux/actions/userAction'
import Sidebar from './sidebar';
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import {Typography} from '@mui/material';

export default function AccountUser() {

    const auth = useSelector(state => state.auth);  
    const {isAdmin} = auth;

    const infor = useSelector(state => state.infor);  
    const {users} = infor;

    const token = useSelector(state => state.token);
    const [callback] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if(isAdmin){
            return fetchAllUsers(token).then(res =>{
                dispatch(dispatchGetAllUsers(res))
            })
        } 
    },[token, isAdmin, dispatch, callback])

    const columns = [
        {
          name: <Typography>Email</Typography>,
          selector: "email",
        },
        {
          name: <Typography>Tên người dùng</Typography>,
          selector: "name",
          sortable: true
        },
        {
          name: <Typography>Trạng thái</Typography>,
          selector: "status",
        },
        {
          name: "",
          selector: "edit",
        }
      ];
     
      const data = users.map((user) => (
                {    
                    email: <Typography>{user.Email}</Typography>,
                    name: <Typography>{user.Ten}</Typography>,
                    status: user.TrangThai ===1 ? <Typography>Hoạt động</Typography>: <Typography sx = {{color: 'red'}}>Đã khóa</Typography>,
                    edit: <Link to = {`/update-info/${user._id}`} className="btn btn-white shadow-warning text-warning">Chỉnh sửa</Link>                   
                })
           
          )

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
            <div className="page-heading pb-2 mt-4 mb-2 ">
                    <h3>Tài khoản của khách hàng</h3>
                </div>     
                <div class="page-content">
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
