import ACTIONS from './index';
import axios from 'axios';

// Gọi API từ controller qua bên react redux
export const fetchShipper = async () => {
    const res = await axios.get(`http://localhost:5000/user/shipper`);
    return res;
}

// Trả về dữ liệu theo loại ACTION đã được khai báo
export const dispatchGetShipper = (res) => {
    return {
        type: ACTIONS.GET_SHPPIER,
        payload: res.data
    }
}