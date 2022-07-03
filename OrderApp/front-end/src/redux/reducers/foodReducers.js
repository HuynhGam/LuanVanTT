import ACTIONS from '../actions'

const food = [];

// Xử lý Action để đưa lên Redux
const foodReducer = (state = food , action) => {
    switch(action.type){
        case ACTIONS.GET_ALL_MENU:
            return action.payload
        default:
            return state
    }
}


export default foodReducer
