import {SEARCH_SUCCESS, SEARCH_FAILED} from "../actions/types";

const initialState = {
    trips: [],
    tripsWithUser: [],
    users: [],
    loading: true
}

export default (state = initialState, action) => {
    const {type, payload} = action;

    switch (type) {
        case SEARCH_SUCCESS:
            return{
                ...state,
                trips: payload.trips,
                tripsWithUser: payload.tripsWithUser,
                users: payload.profiles,
                loading: false
            }
        case SEARCH_FAILED:{
            return{
                ...state,
                trips: [],
                tripsWithUser: [],
                users: [],
                loading: false
            }
        }
        default:
            return state
    }
}