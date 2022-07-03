import ACTIONS from './index';
import axios from 'axios';


// Gọi API từ controller qua bên react redux
export const fetchSearch = async (searchInput) => {
    const res = await axios.post("http://localhost:5000/store/search", {searchInput});
    return res;
}

// Trả về dữ liệu theo loại ACTION đã được khai báo
export const dispatchSearch = (res) => {
    return {
        type: ACTIONS.RESULT_SEARCH,
        payload: res.data
    }
} 



