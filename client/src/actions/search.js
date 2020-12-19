import {SEARCH_SUCCESS, SEARCH_FAILED} from "./types";
import axios from "axios";

export const searchValue = (val) => async dispatch =>{
    try {
        const res = await axios.get("/search/"+val)
        dispatch({
            type: SEARCH_SUCCESS,
            payload: res.data
        })

    }catch (e) {
        console.log(e.message)
        dispatch({
            type: SEARCH_FAILED
        })
    }
}