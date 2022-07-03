import ACTIONS from './index';
import axios from 'axios';


// Gọi API từ controller qua bên react redux
export const fetchAllStores = async (token, id) => {
    const res = await axios.get(`http://localhost:5000/user/all_store/${id}`, {
        headers: {Authorization: token}
    });
    return res;
}

// Trả về dữ liệu theo loại ACTION đã được khai báo
export const dispatchGetAllStores = (res) => {
    return {
        type: ACTIONS.GET_ALL_STORES,
        payload: res.data
    }
}
// Gọi API từ controller qua bên react redux
export const fetchStores = async (token) => {
    const res = await axios.get(`http://localhost:5000/user/stores`, {
        headers: {Authorization: token}
    });
    return res
}
// Trả về dữ liệu theo loại ACTION đã được khai báo
export const dispatchGetStores = (res) => {
    return {
        type: ACTIONS.GET_STORES,
        payload: res.data
    }
}
// Gọi API từ controller qua bên react redux
export const fetchStore = async (id) => {
    const res = await axios.patch(`http://localhost:5000/store/get_store/${id}`);
    return res
}
// Trả về dữ liệu theo loại ACTION đã được khai báo
export const dispatchGetStore = (res) => {
    return {
        type: ACTIONS.STORE,
        payload: res.data
    }
}

