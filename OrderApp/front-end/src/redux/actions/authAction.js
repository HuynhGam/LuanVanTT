import ACTIONS from './index';
import axios from 'axios';

export const dispatchLogin = () => {
    return {
        type: ACTIONS.LOGIN
    }
}

// Gọi API lấy thông tin user từ controller
export const fetchUser = async(token) => {
   const res = await axios.get('http://localhost:5000/user/infor', {
   headers: {Authorization: token}
});
return res

}
// Trả về dữ liệu theo loại ACTION đã được khai báo
export const dispatchGetUser= (res) => {
    return {
        type: ACTIONS.GET_USER,
        payload: {
            role: res.data.role,
            user: res.data.user,
            isAdmin: res.data.role.VaiTro === 0 ? true : false, // xác minh Admin theo vai trò
            isSeller: res.data.role.VaiTro === 2 ? true : false // xác minh Seller theo vai trò
        }
    }
}


