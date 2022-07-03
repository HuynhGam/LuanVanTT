import ACTIONS from './index';
import axios from 'axios';


export const fetchOrder = async (email) => {
    const res = await axios.patch(`http://localhost:5000/store/get_oder/${email}`);
    return res;
}

export const dispatchGetOrder = (res) => {
    return {
        type: ACTIONS.GET_ORDER,
        payload: res.data
    }
}


export const fetchProcess = async (email) => {
    const res = await axios.patch(`http://localhost:5000/store/process_oder/${email}`);
    return res;
}


export const dispatchGetProcess = (res) => {
    return {
        type: ACTIONS.PROCESS,
        payload: res.data
    }
}


export const fetchReq = async (email) => {
    const res = await axios.patch(`http://localhost:5000/store/req/${email}`);
    return res;
}


export const dispatchGetReq = (res) => {
    return {
        type: ACTIONS.REQ_ORDER,
        payload: res.data
    }
}

// export const fetchOrStore = async (email) => {
//     const res = await axios.patch(`http://localhost:5000/store/order_store/${email}`);
//     return res;
// }


// export const dispatchGetOrStore = (res) => {
//     return {
//         type: ACTIONS.GET_ORDER,
//         payload: res.data
//     }
// }
