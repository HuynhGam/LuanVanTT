import ACTIONS from '../actions'

const shippers = [];


// Xử lý Action để đưa lên Redux
const shippersReducer = (state = shippers , action) => {
    switch(action.type){
        case ACTIONS.GET_SHPPIER:
            return action.payload
        default:
            return state
    }
}


export default shippersReducer
