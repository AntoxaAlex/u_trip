import {GET_COMMENT_BY_ID, COMMENT_FAILED} from "../actions/types";

const initialState ={
    comment: null,
    comments: [],
    isEdited: false,
    loading: true,
    errors: {}
};

export default (state = initialState, action) => {
    const {type, payload} = action;
    switch (type) {
        case GET_COMMENT_BY_ID:
            return {
                ...state,
                comment: payload,
                isEdited: true,
                loading: false
            }
        case COMMENT_FAILED:
            return {
                ...state,
                loading: false
            }
        default:
            return state
    }
}