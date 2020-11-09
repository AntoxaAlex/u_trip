
import {NEW_TRIP_SUCCESS, NEW_TRIP_FAILED, GET_TRIP_BY_ID, PROFILE_ERROR, GET_ALL_MY_TRIPS} from "./types";
import axios from "axios";
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

//Create new trip
export const createTrip = (
    tripImage,
    title,
    trip_description,
    from,
    to,
    isCompleted,
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

    const body = JSON.stringify({
        tripImage,
        title,
        trip_description,
        from,
        to,
        isCompleted,
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
    })

    try {
        // const imageUrl = await axios.post("/trips/tripimage", imageForm);
        const res = await axios.post("/trips", body, config);

        console.log(res.data)
        dispatch({
            type: NEW_TRIP_SUCCESS,
            payload: res.data
        })
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


