import ACTIONS from './index';
import axios from 'axios';


// Gọi API từ controller qua bên react redux
export const fetchCannel = async (id) => {
    const res = await axios.patch(`http://localhost:5000/store/cannel_order/${id}`);
    return res;
}

// Trả về dữ liệu theo loại ACTION đã được khai báo
export const dispatchGetCannel = (res) => {
    return {
        type: ACTIONS.GET_ORDER_CANNEL,
        payload: res.data
    }
}
