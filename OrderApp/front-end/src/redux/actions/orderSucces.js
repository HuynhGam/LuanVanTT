import ACTIONS from './index';
import axios from 'axios';


export const fetchOrStore = async (id) => {
    const res = await axios.patch(`http://localhost:5000/store/order_store/${id}`);
    return res;
}

export const dispatchGetOrStore = (res) => {
    return {
        type: ACTIONS.GET_ORDER_SUCC,
        payload: res.data
    }
}
