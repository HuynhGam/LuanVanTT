import ACTIONS from '../actions'

const order_succ = [];

// Xử lý Action để đưa lên Redux
const succReducer = (state = order_succ, action) => {
    switch(action.type){
        case ACTIONS.GET_ORDER_SUCC:
            return action.payload
        default:
            return state
    }
}

export default succReducer
