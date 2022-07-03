import ACTIONS from '../actions'

const token = ''


// Xử lý ACTION get token
const tokenReducers = (state =token, action) => {
    switch(action.type){
        case ACTIONS.GET_TOKEN:
            return action.payload 
        default:
            return state
    }
} 
export default tokenReducers