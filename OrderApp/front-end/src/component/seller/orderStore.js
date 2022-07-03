import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import Sidebar from '../seller/sidebar';
import {fetchStores, dispatchGetStores} from '../../redux/actions/storeAction';
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import {Box, Button, Stack, Typography, Paper, Grid} from '@mui/material';


export default function Store() {
    const auth = useSelector(state => state.auth);
    const { isSeller } = auth;

    const token = useSelector(state => state.token);
    const stores = useSelector(state => state.stores);
    
    const [callback] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if(isSeller){
            return fetchStores(token).then(res =>{
                dispatch(dispatchGetStores(res));
            })
        }
    },[token, isSeller, dispatch, callback])

    const columns = [
        {
          selector: "xem"
        },
        {
          name: <Typography sx={{fontSize: 16, fontWeight: 600}}>Cửa hàng </Typography>,
          selector: "store",
          sortable: true,
          width: "450px"
          
        },
        {
          name: <Typography sx={{fontSize: 16, fontWeight: 600}}>Trạng thái</Typography>,
          selector: "status",
          width: "200px"
        },
      ];

      const data = stores.map(store => (
          {
            xem: <Link to = {`/detail_order/${store._id}`} className="btn btn-white shadow-warning text-warning">Quản lý đơn hàng</Link>,
            store: <Typography sx={{fontSize: 14}}>{store.TenCH}</Typography>,
            status: store.TrangThai === 1 ? <Typography sx={{fontSize: 14}}>Còn kinh doanh</Typography> : <Typography sx={{fontSize: 13, color: 'red'}}>Ngừng kinh doanh</Typography>,
            edit: <Link to = {`/update-store/${store._id}`} className="btn btn-white shadow-warning text-warning">Chỉnh sửa</Link>
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
                <div className="page-heading pb-2 mt-4 mb-2 ">
          
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
