import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux'
import {fetchAllStores, dispatchGetAllStores} from '../../redux/actions/storeAction';
import Sidebar from './sidebar';
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import {Typography} from '@mui/material';


export default function StoreManager() {

    const {id} = useParams();
    const auth = useSelector(state => state.auth);
    const token = useSelector(state => state.token);
    const stores = useSelector(state => state.stores);
    const {isAdmin} = auth;

    const [callback] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if(isAdmin){
            return fetchAllStores(token, id).then(res =>{
                dispatch(dispatchGetAllStores(res));
            })
        }
    },[token, isAdmin, dispatch, callback])

    const columns = [      
        {
          name: <Typography sx={{fontWeight: 600}}>Cửa hàng</Typography>,
          selector: "store",
          sortable: true,
          width: "300px"
        },
        {
          name: <Typography sx={{fontWeight: 600}}>Địa chỉ</Typography>,
          selector: "address",
          width: "550px"
        },
        {
            name:  <Typography sx={{fontWeight: 600}}>Số điện thoại</Typography>,
            selector: "phone",
            width: "200px"
        },
        {
          name:  <Typography sx={{fontWeight: 600}}>Trạng thái</Typography>,
          selector: "status",
        }
      ];
     
      const data = stores.map(store => (
          {
            store:  <Typography>{store.TenCH}</Typography>,
            address: <Typography>{store.DiaChi}</Typography>,
            phone: <Typography>{store.SDT}</Typography>,
            status: store.TrangThai ===1 ? <Typography>Còn kinh doanh</Typography>: <Typography sx = {{color: 'red'}}>Còn kinh doanh</Typography>,
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
                <div className="page-heading pb-2 mt-4 mb-2">
                    <h3>{id}</h3>
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
