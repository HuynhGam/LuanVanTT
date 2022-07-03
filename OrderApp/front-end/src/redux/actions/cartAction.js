import ACTIONS from './index';
import axios from 'axios';


// Gọi API từ controller qua bên react redux
export const fetchCart = async (id) => {
    const res = await axios.patch(`http://localhost:5000/store/cart/${id}`);
    return res;
}

// Trả về dữ liệu theo loại ACTION đã được khai báo
export const dispatchGetCart = (res) => {
    return {
        type: ACTIONS.GET_CART,
        payload: res.data
    }
}



