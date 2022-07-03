import ACTIONS from './index';
import axios from 'axios';


// Gọi API từ controller qua bên react redux
export const fetchAddress = async (id) => {
    const res = await axios.patch(`http://localhost:5000/address/get_address/${id}`);
    return res;
}

// Trả về dữ liệu theo loại ACTION đã được khai báo
export const dispatchGetAddress = (res) => {
    return {
        type: ACTIONS.GET_ADDRESS,
        payload: res.data
    }
}
