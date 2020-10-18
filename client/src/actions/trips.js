import {NEW_TRIP_SUCCESS, NEW_TRIP_FAILED, GET_PROFILE, PROFILE_ERROR, GET_ALL_MY_TRIPS} from "./types";
import axios from "axios";
import {setAlert} from "./alert";


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

//Create new trip
export const createTrip = (
    image,
    title,
    starting_point,
    campContent,
    final_destination,
    from,
    to,
    trip_description
) => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }
    console.log(
        "Title: " + title,
        "Starting point" + starting_point,
        "Camps" + campContent,
        "Final destination" + final_destination,
        "From" + from,
        "To" + to,
        "Description" + trip_description
    )




    try {
        const imageUrl = await axios.post("/trips/tripimage", image);

        const body = JSON.stringify({
            imageUrl: imageUrl.data,
            title,
            starting_point,
            campContent,
            final_destination,
            from,
            to,
            trip_description
        })

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
