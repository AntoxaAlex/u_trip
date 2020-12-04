import {NEW_TRIP_SUCCESS, NEW_TRIP_FAILED, GET_ALL_MY_TRIPS, GET_TRIP_BY_ID, GET_CURRENT_TRIP, GET_ALL_TRIPS} from "../actions/types";

const initialState ={
    trip: null,
    trips: [],
    currentTrip: null,
    loading: true,
    isCreated: false,
    errors: {},
    positionObj: null,
    posId: null
};

export default (state = initialState, action) =>{
    const {type, payload} = action;

    switch (type) {
        case NEW_TRIP_SUCCESS:
            return {
                ...state,
                trip: payload,
                loading: false,
                isCreated: true
            }
        case GET_ALL_MY_TRIPS:
            return {
                ...state,
                trips: payload,
                loading: false
            }
        case GET_ALL_TRIPS:
            return {
                ...state,
                trips: payload,
                loading: false
            }
        case GET_TRIP_BY_ID:
            return {
                ...state,
                trip: payload,
                loading: false
            }
        case GET_CURRENT_TRIP:
            return {
                ...state,
                currentTrip: payload,
                loading: false
            }
        case NEW_TRIP_FAILED:
            return {
                ...state,
                // errors: payload,
                loading: false
            }
        default:
            return state
    }
}