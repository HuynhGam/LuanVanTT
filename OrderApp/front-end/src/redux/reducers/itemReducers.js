import ACTIONS from '../actions'

const item = '';

// Xử lý Action để đưa lên Redux
const itemReducer = (state = item , action) => {
    switch(action.type){
        case ACTIONS.COUNT_ITEMS:
            return action.payload.item
        default:
            return state
    }
}


export default itemReducer
