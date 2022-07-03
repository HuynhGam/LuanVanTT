import ACTIONS from '../actions'

const stores = [];

const initailState = {storeInfo: [], loading: true};

// Xử lý Action để đưa lên Redux
const storesReducer = (state = stores , action) => {
    switch(action.type){
        case ACTIONS.GET_ALL_STORES:
            return action.payload
        case ACTIONS.GET_STORES:
            return action.payload 
        case ACTIONS.STORE:
            return action.payload 
        default:
            return state
    }
}


export default storesReducer
