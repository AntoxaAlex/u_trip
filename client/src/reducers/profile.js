import {PROFILE_ERROR, GET_PROFILE, NEW_PROFILE, CLEAR_PROFILE, CHANGE_TAB, GET_ALL_PROFILES, GET_ALL_PROFILES_EXEPT, GET_MY_PROFILE} from "../actions/types";

const initialState = {
    myProfile: null,
    profile: null,
    profiles: [],
    loading: true,
    error: {},
    isUpdated: false,
    activeTab: "skills"
}

export default (state = initialState, action) => {
    const {type, payload} = action;

    switch (type) {
        case GET_MY_PROFILE:
            return {
                ...state,
                myProfile: payload,
                loading: false
            }
        case GET_PROFILE:
            return {
                ...state,
                profile: payload,
                loading: false
            }
        case GET_ALL_PROFILES:
            return {
                ...state,
                profiles: payload,
                loading: false
            }
        case GET_ALL_PROFILES_EXEPT:
            return {
                ...state,
                profiles: payload,
                loading: false
            }
        case NEW_PROFILE:
            return {
                ...state,
                loading: false,
                isUpdated: true
            }
        case PROFILE_ERROR:
            return {
                ...state,
                loading: false,
                error: payload
            }
        case CLEAR_PROFILE:
            return {
                ...state,
                loading: false,
                profile: null
            }
        case CHANGE_TAB:
            return {
                ...state,
                activeTab: payload
            }
        default:
            return state;
    }
}