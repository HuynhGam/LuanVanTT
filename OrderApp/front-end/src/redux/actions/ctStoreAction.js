import ACTIONS from './index';
import axios from 'axios';

// Gọi API từ controller qua bên react redux
export const fetchCountStore = async () => {
    const res = await axios.get(`http://localhost:5000/store/count`);
    return res;
}

// Trả về dữ liệu theo loại ACTION đã được khai báo
export const dispatchGetCountStore = (res) => {
    return {
        type: ACTIONS.COUNT_STORE,
        payload: res.data
    }
}

// Gọi API từ controller qua bên react redux (đếm cửa hàng)
export const fetchCountStores = async(Email) => {
    const res = await axios.patch(`http://localhost:5000/store/count_stores/${Email}`);
    return res;
}

// Trả về dữ liệu theo loại ACTION đã được khai báo
export const dispatchGetCountStores = (res) => {
    return {
        type: ACTIONS.COUNT_STORES,
        payload: res.data
    }
}