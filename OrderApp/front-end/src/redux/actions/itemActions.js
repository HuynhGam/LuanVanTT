import ACTIONS from './index';
import axios from 'axios';

// Gọi API từ controller qua bên react redux
export const fetchItem = async (id) => {
    const res = await axios.patch(`http://localhost:5000/store/count_item/${id}`);
    return res;
}

// Trả về dữ liệu theo loại ACTION đã được khai báo
export const dispatchGetItem = (res) => {
    return {
        type: ACTIONS.COUNT_ITEMS,
        payload: res.data
    }
}