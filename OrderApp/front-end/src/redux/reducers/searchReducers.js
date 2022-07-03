import ACTIONS from '../actions'

const result = [];

// Xử lý Action để đưa lên Redux
const searchReducer = (state = result , action) => {
    switch(action.type){
        case ACTIONS.RESULT_SEARCH:
            return action.payload
        default:
            return state
    }
}


export default searchReducer
