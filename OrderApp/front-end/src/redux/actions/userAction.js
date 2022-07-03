import ACTIONS from './index';
import axios from 'axios';

//Gọi API từ controller qua bên react redux
export const fetchAllUsers = async (token) => {
    const res = await axios.get('http://localhost:5000/user/all_infor', {
        headers: {Authorization: token}
    });
    return res;
}

// Trả về dữ liệu theo loại ACTION đã được khai báo
export const dispatchGetAllUsers = (res) => {
    return {
        type: ACTIONS.GET_ALL_USERS,
        payload: res.data
    }
}