import ACTIONS from '../actions'

const cart = [];

// Xử lý Action để đưa lên Redux
const cartReducer = (state = cart , action) => {
    switch(action.type){
        case ACTIONS.GET_CART:
            return action.payload
        default:
            return state
    }
}


export default cartReducer
