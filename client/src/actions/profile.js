import axios from "axios";
import {setAlert} from "./alert";

import {GET_PROFILE, PROFILE_ERROR, NEW_PROFILE, CHANGE_TAB, CLEAR_PROFILE, GET_ALL_PROFILES, GET_ALL_PROFILES_EXEPT} from "./types";

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

export const getAllProfiles = () => async dispatch =>{
    try{
        const res = await axios.get("/profile/")
        dispatch({
            type: GET_ALL_PROFILES,
            payload: res.data
        })
    } catch (e) {
        console.log(e.message)
    }
}

export const getProfileById = (id) => async dispatch =>{
    try {
        const res = await axios.get(`/profile/user/${id}`);

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

export const getAllProfilesExceptOwn = () => async dispatch =>{
    try{
        const res = await axios.get("/profile/except")
        console.log(res.data)
        dispatch({
            type: GET_ALL_PROFILES_EXEPT,
            payload: res.data
        })
    } catch (e) {
        console.log(e.message)
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
    preferences,
    gender,
    bio,
    instagram,
    facebook,
    vk,
    pinterest,
    website
) => async dispatch =>{
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }



    try {
        console.log(avatar)
        const imageUrl = typeof avatar === "string" ? avatar : await axios.post("/profile/avatar", avatar);
        console.log(imageUrl)
        const body = JSON.stringify({
            imageUrl: imageUrl.data,
            dob,
            place,
            job,
            preferences,
            gender,
            bio,
            instagram,
            facebook,
            vk,
            pinterest,
            website
        })
        console.log(body)
        const res = await axios.post("/profile", body, config);
        dispatch(
            {
            type: NEW_PROFILE,
            payload: res.data
            })
        dispatch(setAlert("Profile is updated","success"))
    }catch (e) {
        const errors = e.response.data.errors;
        console.log(errors)
        errors.forEach(error=>dispatch(setAlert(error.msg, "danger"))
        );
        dispatch({
            type: PROFILE_ERROR
        })
    }
}

export const uploadProfileImage = async (image)=>{
    try {
        const imageUrl = await axios.post("/profile/avatar", image);
        return imageUrl.data
    }
    catch (e) {
        console.log(e.message)
    }
}

export const deleteUser = () => async dispatch =>{
    try{
        await axios.delete("/profile")
        dispatch({
            type: CLEAR_PROFILE
        })
    }catch (e) {
        console.log(e)
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

export const setProfileStatus = (status) => async dispatch =>{
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }
    try{
        const body = JSON.stringify({status})
        const res = await axios.post("/profile/status", body, config)
        dispatch({
            type: NEW_PROFILE,
            payload: res.data
        })

    }catch (e) {
        console.log(e)
    }
}
