import ACTIONS from './index';
import axios from 'axios';

// Gọi API từ controller qua bên react redux
export const fetchCount = async () => {
    const res = await axios.get(`http://localhost:5000/user/count`);
    return res;
}

// Trả về dữ liệu theo loại ACTION đã được khai báo
export const dispatchGetCount = (res) => {
    return {
        type: ACTIONS.COUNT_ACCOUNT,
        payload: res.data
    }
}