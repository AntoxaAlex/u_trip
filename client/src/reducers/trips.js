import {
    NEW_TRIP_SUCCESS,
    NEW_TRIP_FAILED,
    GET_ALL_MY_TRIPS,
    GET_TRIP_BY_ID,
    GET_CURRENT_TRIP,
    GET_ALL_TRIPS,
    NOT_READY_TRIP,
    GET_NEAREST_TRIPS
} from "../actions/types";

const initialState ={
    trip: null,
    trips: [],
    currentTrip: null,
    nearestTrips: [],
    loading: true,
    status: null,
    isCreated: null,
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
                isCreated: true,
                status: null
            }
        case GET_ALL_MY_TRIPS:
            return {
                ...state,
                trips: payload,
                loading: false,
                isCreated: false,
                status: null
            }
        case GET_ALL_TRIPS:
            return {
                ...state,
                trips: payload,
                loading: false,
                isCreated: false,
                status: null
            }
        case GET_TRIP_BY_ID:
            return {
                ...state,
                trip: payload,
                loading: false,
                isCreated: false,
                status: null
            }
        case GET_CURRENT_TRIP:
            return {
                ...state,
                currentTrip: payload,
                loading: false,
                isCreated: false,
                status: null
            }
        case GET_NEAREST_TRIPS:
            return {
                ...state,
                nearestTrips: payload,
                loading: false,
                isCreated: false,
                status: null
            }
        case NEW_TRIP_FAILED:
            return {
                ...state,
                // errors: payload,
                loading: false,
                isCreated: null,
                status: null
            }
        case NOT_READY_TRIP:
            return {
                ...state,
                status: payload.status,
                trip: payload.id
            }
        default:
            return state
    }
}