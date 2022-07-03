import ACTIONS from './index';
import axios from 'axios';


// Gọi API từ controller qua bên react redux
export const fetchRate = async (id) => {
    const res = await axios.patch(`http://localhost:5000/store/get_rate/${id}`);
    return res;
}

// Trả về dữ liệu theo loại ACTION đã được khai báo
export const dispatchGetRate = (res) => {
    return {
        type: ACTIONS.RATE,
        payload: res.data
    }
}
