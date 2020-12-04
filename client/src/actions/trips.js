
import {
    NEW_TRIP_SUCCESS,
    NEW_TRIP_FAILED,
    GET_TRIP_BY_ID,
    PROFILE_ERROR,
    GET_ALL_MY_TRIPS,
    GET_COMMENT_BY_ID,
    COMMENT_FAILED,
    NEW_PROFILE,
    GET_CURRENT_TRIP,
    GET_ALL_TRIPS
} from "./types";
import axios from "axios";
import React from "react";
// import {setAlert} from "./alert";


//Get all own trips
export const getAllMyTrips = () => async dispatch =>{
    try {
        const res = await axios.get("/trips/me");
        console.log(res)
        dispatch({
            type: GET_ALL_MY_TRIPS,
            payload: res.data
        })
    }catch (e) {
        dispatch({
            type:PROFILE_ERROR,
            payload: {msg: e.response.data.msg, status: e.response.status}
        })
    }
}

//Get all user's trips
export const getAllUserTrips = (id) => async dispatch =>{
    try {
        const res = await axios.get(`/trips/all/${id}`);
        console.log(res)
        dispatch({
            type: GET_ALL_MY_TRIPS,
            payload: res.data
        })
    }catch (e) {
        dispatch({
            type:PROFILE_ERROR,
            payload: {msg: e.response.data.msg, status: e.response.status}
        })
    }
}

export const getAllTrips = () => async dispatch =>{
    try{
        const res = await axios.get("/trips/")
        dispatch({
            type: GET_ALL_TRIPS,
            payload: res.data
        })
    }catch (e) {
        console.log(e.message)
    }
}

//Get trip by id
export const getTripById = (id) => async dispatch => {
    try{
        const res = await axios.get("/trips/"+id)
        dispatch({
            type: GET_TRIP_BY_ID,
            payload: res.data
        })
    }catch (e) {
        console.log(e)
        dispatch({
            type: NEW_TRIP_FAILED,
        })
    }
}
//Get current trip
export const getCurrentTrip = () => async dispatch => {
    try{
        const res = await axios.get("/trips/current")
        dispatch({
            type: GET_CURRENT_TRIP,
            payload: res.data
        })
    }catch (e) {
        console.log(e)
        dispatch({
            type: NEW_TRIP_FAILED,
        })
    }
}

//Get current trip of user
export const getUserCurrentTrip = (id) => async dispatch => {
    try{
        const res = await axios.get(`/trips/${id}/current`)
        dispatch({
            type: GET_CURRENT_TRIP,
            payload: res.data
        })
    }catch (e) {
        console.log(e)
        dispatch({
            type: NEW_TRIP_FAILED,
        })
    }
}


//Create new trip
export const createTrip = (
    id,
    dir,
    tripImage,
    tripType,
    title,
    trip_description,
    from,
    assembledTeammates,
    sp_title,
    sp_description,
    sp_image,
    sp_latitude,
    sp_longitude,
    campContent,
    fd_title,
    fd_description,
    fd_image,
    fd_latitude,
    fd_longitude
) => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }

    console.log(tripImage)
    console.log(sp_image)
    console.log(fd_image)
    campContent.map(camp=>{
        console.log(camp.campImage)
    })

    try {
            const tripImageUrl = await axios.post("/trips/uploadImage", tripImage)
            const spImageUrl = await axios.post("/trips/uploadImage", sp_image)
            const fdImageUrl = await axios.post("/trips/uploadImage", fd_image)
            const newCampContent = []
            campContent.map(async camp=>{
                try{
                 const campImageUrl = await axios.post("/trips/uploadImage", camp.campImage)
                  await newCampContent.push({
                        campImage: campImageUrl.data,
                        campTitle: camp.campTitle,
                        campDescription: camp.campDescription,
                        campLatitude: camp.campLatitude,
                        campLongitude: camp.campLongitude,
                    })
                }catch (e) {
                    console.log(e.message)
                }
            })
        console.log(tripImageUrl)
        console.log(spImageUrl)
        console.log(fdImageUrl)
        console.log(newCampContent)

        const body = JSON.stringify({
            tripImage: tripImageUrl.data,
            title,
            trip_description,
            from,
            assembledTeammates,
            sp_title,
            sp_description,
            sp_image: spImageUrl.data,
            sp_latitude,
            sp_longitude,
            campContent: newCampContent,
            fd_title,
            fd_description,
            fd_image: fdImageUrl.data,
            fd_latitude,
            fd_longitude
        })

        if(dir === "create"){
            const res = await axios.post("/trips", body, config);
            dispatch({
                type: NEW_TRIP_SUCCESS,
                payload: res.data
            })
        }else if(dir === "edit"){
            console.log("edit")
            const res = await axios.put("/trips/"+id, body, config);
            dispatch({
                type: NEW_TRIP_SUCCESS,
                payload: res.data
            })
        }
    }catch (e) {
        // const errors = e.response.data.errors;
        // console.log(errors);
        // errors.forEach(error=>dispatch(setAlert(error.msg, "danger"))
        // );
        // dispatch({
        //     type: NEW_TRIP_FAILED
        // })
        console.log(e)
    }
}

//Immediately complete trip
export const completeTrip = (id) => async dispatch => {
    const today = new Date();
    const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()+".000+00:00";
    const dateTime = date+'T'+time;
    console.log(dateTime)

    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }
    const body = JSON.stringify({
        isCompleted: true,
        to: dateTime
    })

    console.log(body)
    try {
        const res = await axios.put("/trips/"+id+"/complete", body, config);
        dispatch({
            type: NEW_TRIP_SUCCESS,
            payload: res.data
        })
    }
    catch (e) {
            console.log(e.message)
    }
}

//Delete trip
export const removeTrip = (id) => async dispatch =>{
    try {
        const res = await axios.delete("/trips/"+id)
        dispatch({
            type: NEW_PROFILE,
            payload: res.data
        })
    } catch (e) {
        console.log(e)
    }
}

//Get comment by id
export const getCommentById = (trip_id, comment_id) => async dispatch => {
    try{
        const res = await axios.get("/trips/show/"+trip_id+"/posts/"+comment_id)
        dispatch({
            type: GET_COMMENT_BY_ID,
            payload: res.data
        })
    }catch (e) {
        console.log(e)
        dispatch({
            type: COMMENT_FAILED,
        })
    }
}

//Create comment
export const createComment = (text, id, profileImage, username) =>async dispatch=>{
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }

    const body = JSON.stringify({
        username,
        profileImage,
        text
        // likes,
    })

    try {
        const res = await axios.post("/trips/show/"+id+"/posts", body, config)
        console.log(res.data)
        dispatch({
            type: NEW_TRIP_SUCCESS,
            payload: res.data
        })
    }catch (e) {
        console.log(e.message)
    }

}

//Edit comment
export const editComment = (name, text, trip_id, comment_id) => async dispatch =>{
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }
    const body = JSON.stringify({text})

    try {
        const res = await axios.put("/trips/show/"+trip_id+"/posts/"+ comment_id, body, config)
        dispatch({
            type: NEW_TRIP_SUCCESS,
            payload: res.data
        })
    }catch (e) {
        console.log(e)
    }
}

export const createReply = (text, id, commentId, profileImage, username) =>async dispatch=>{
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }

    const body = JSON.stringify({
        username,
        profileImage,
        text
        // likes,
    })

    try {
        const res = await axios.put("/trips/show/"+id+"/posts/" + commentId +"/reply", body, config)
        console.log(res.data)
        dispatch({
            type: NEW_TRIP_SUCCESS,
            payload: res.data
        })
    }catch (e) {
        console.log(e.message)
    }

}

//Manage likes

export const addLike = (tripId, commentId) => async dispatch =>{
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }
    try{
        const res = await axios.put("/trips/show/"+tripId+"/posts/"+commentId+"/like", config)
        console.log(res.data)
        dispatch({
            type: NEW_TRIP_SUCCESS,
            payload: res.data
        })
    }catch (e) {
        console.log(e.message)
    }
}

export const setRating = (val,tripId) => async dispatch =>{
    console.log(val, tripId)
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }
    const body = JSON.stringify({val})

    try{
        const res = await axios.post("/trips/"+tripId+"/rating",body, config)
        dispatch({
            type: NEW_TRIP_SUCCESS,
            payload: res.data
        })
    }catch (e) {
        console.log(e.message)
    }
}

export const removeCommentReply = (id, index, tripId, commentId,) => async dispatch =>{
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }

    if(id === "comment"){
        const res = await axios.delete("/trips/show/"+tripId+"/posts/"+commentId, config)
        dispatch({
            type: NEW_TRIP_SUCCESS,
            payload: res.data
        })
    }else if(id==="reply"){
        const res = await axios.delete("/trips/show/"+tripId+"/posts/"+commentId+"/reply/"+index, config)
        dispatch({
            type: NEW_TRIP_SUCCESS,
            payload: res.data
        })
    }
}


