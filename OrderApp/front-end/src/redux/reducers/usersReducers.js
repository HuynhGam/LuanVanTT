import ACTIONS from '../actions'

// const users = [];


// // Xử lý Action get all user
// const usersReducer = (state = users , action) => {
//     switch(action.type){
//         case ACTIONS.GET_ALL_USERS:
//             return action.payload
//         default:
//             return state
//     }
// }

// Khởi tạo biến trên redux
const initialState = {
    users: '',
    sellers: '',
}

// Xử lý Action để đưa lên Redux
const usersReducer = (state = initialState, action) => {
    switch(action.type){
        case ACTIONS.GET_ALL_USERS:
            return {
                users: action.payload.users,
                sellers: action.payload.sellers,
            }
        default:
            return state
    }
}



export default usersReducer
