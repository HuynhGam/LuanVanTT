import ACTIONS from '../actions'

const order = [];

// Xử lý Action để đưa lên Redux
const itemReducer = (state = order, action) => {
    switch(action.type){
        case ACTIONS.GET_ORDER:
            return action.payload
        case ACTIONS.PROCESS:
            return action.payload
        case ACTIONS.REQ_ORDER:
            return action.payload
        default:
            return state
    }
}


export default itemReducer
