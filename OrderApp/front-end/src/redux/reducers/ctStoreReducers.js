import ACTIONS from '../actions/'

// Khởi tạo biến trên redux
const initialState = {
    total: '',
    business: ''
}

// Xử lý Action để đưa lên Redux
const countStoreReducer = (state = initialState, action) => {
    switch(action.type){
        case ACTIONS.COUNT_STORE:
            return {
                ...state,
                total: action.payload.total,
                business: action.payload.on,
            }
        case ACTIONS.COUNT_STORES:
            return {
                ...state,
                total: action.payload.total,
                business: action.payload.on,
            }
        default:
            return state
    }
}

export default countStoreReducer