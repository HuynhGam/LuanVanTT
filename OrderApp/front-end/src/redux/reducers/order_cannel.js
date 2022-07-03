import ACTIONS from '../actions'

const order_cannel = [];

// Xử lý Action để đưa lên Redux
const cannelReducer = (state = order_cannel, action) => {
    switch(action.type){
        case ACTIONS.GET_ORDER_CANNEL:
            return action.payload
        default:
            return state
    }
}

export default cannelReducer
