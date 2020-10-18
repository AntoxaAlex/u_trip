import axios from "axios";
import {setAlert} from "./alert";

import {GET_PROFILE, PROFILE_ERROR, NEW_PROFILE, CHANGE_TAB} from "./types";

export const getCurrentProfile = () => async dispatch =>{
    try {
        const res = await axios.get("/profile/me");

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })
    }catch (e) {
        dispatch({
            type:PROFILE_ERROR,
            payload: {msg: e.response.data.msg, status: e.response.status}
        })
    }
}

export const createProfile = (
    avatar,
    dob,
    place,
    job,
    tripdays,
    preferences,
    gender,
    bio,
    instagram,
    facebook,
    vk,
    pinterest,
    website,
    date
) => async dispatch =>{
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }



    try {
        const imageUrl = await axios.post("/profile/avatar", avatar);
        console.log(imageUrl)
        const body = JSON.stringify({
            imageUrl: imageUrl.data,
            dob,
            place,
            job,
            tripdays,
            preferences,
            gender,
            bio,
            instagram,
            facebook,
            vk,
            pinterest,
            website,
            date
        })
        const res = await axios.post("/profile", body, config);
        dispatch({
            type: NEW_PROFILE,
            payload: res.data
        })
    }catch (e) {
        const errors = e.response.data.errors;
        console.log(errors);
        errors.forEach(error=>dispatch(setAlert(error.msg, "danger"))
        );
        dispatch({
            type: PROFILE_ERROR
        })
    }
}

export const changeTab = (tabName) => async dispatch =>{
    try {
        dispatch({
            type: CHANGE_TAB,
            payload: tabName
        })
    }catch (e) {
        console.log(e)
    }
}
