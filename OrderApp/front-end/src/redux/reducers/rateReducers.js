import ACTIONS from '../actions'

const rating = [];

// Xử lý Action để đưa lên Redux
const rateReducer = (state = rating , action) => {
    switch(action.type){
        case ACTIONS.RATE:
            return action.payload
        default:
            return state
    }
}
export default rateReducer
