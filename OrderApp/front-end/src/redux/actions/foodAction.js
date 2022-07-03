import ACTIONS from './index';
import axios from 'axios';


// Gọi API từ controller qua bên react redux
export const fetchFood = async (type) => {
    const res = await axios.patch(`http://localhost:5000/store/get_food/${type}`);
    return res;
}

// Trả về dữ liệu theo loại ACTION đã được khai báo
export const dispatchGetFood = (res) => {
    return {
        type: ACTIONS.GET_ALL_MENU,
        payload: res.data
    }
}
