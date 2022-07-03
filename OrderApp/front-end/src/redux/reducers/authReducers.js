import ACTIONS from '../actions/'

// Khởi tạo biến trên redux
const initialState = {
    role: '',
    user: '',
    isLogged: false,
    isAdmin: false,
    isSeller: false
}

// Xử lý ACTIOn LOGIN và GET_USER
const authReducer = (state = initialState, action) => {
    switch(action.type){
        case ACTIONS.LOGIN:
            return {
                ...state,
                isLogged: true
            }
        case ACTIONS.GET_USER:
            return {
                ...state,
                role: action.payload.role,
                user: action.payload.user,
                isAdmin: action.payload.isAdmin,
                isSeller: action.payload.isSeller
            }
        default:
            return state
    }
}

export default authReducer