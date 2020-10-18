import {NEW_TRIP_SUCCESS, NEW_TRIP_FAILED, GET_ALL_MY_TRIPS} from "../actions/types";

const initialState ={
    trip: null,
    trips: [],
    loading: true,
    errors: {}
};

export default (state = initialState, action) =>{
    const {type, payload} = action;

    switch (type) {
        case NEW_TRIP_SUCCESS:
            return {
                ...state,
                trip: payload,
                loading: false
            }
        case GET_ALL_MY_TRIPS:
            return {
                ...state,
                trips: payload,
                loading: false
            }
        case NEW_TRIP_FAILED:
            return {
                ...state,
                errors: payload,
                loading: false
            }
        default:
            return state
    }
}