import ACTIONS from '../actions/'

// Khởi tạo biến trên redux
const initialState = {
    total: '',
    user: '',
    seller: ''
}

// Xử lý Action để đưa lên Redux
const countReducer = (state = initialState, action) => {
    switch(action.type){
        case ACTIONS.COUNT_ACCOUNT:
            return {
                ...state,
                total: action.payload.count,
                user: action.payload.user,
                seller: action.payload.seller,
            }
        default:
            return state
    }
}

export default countReducer