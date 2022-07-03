import ACTIONS from '../actions'

const address = [];

// Xử lý Action để đưa lên Redux
const addressReducer = (state = address , action) => {
    switch(action.type){
        case ACTIONS.GET_ADDRESS:
            return action.payload
        default:
            return state;
    }
}


export default addressReducer
