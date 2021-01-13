import axios from "axios";
import {setAlert} from "./alert";
import {
    REGISTER_FAILED,
    REGISTER_SUCCESS,
    USER_LOADED,
    AUTH_ERR,
    LOGIN_FAILED,
    LOGIN_SUCCESS,
    LOGOUT,
    CLEAR_PROFILE,
    GET_MY_PROFILE
} from "./types";
import setAuthToken from "../utils/setAuthToken";


//Load user
export const loadUser = () => async dispatch => {
    if(localStorage.token){
        setAuthToken(localStorage.token)
    }
    
    try {
        const resUser = await axios.get("/auth");

        const resProfile = await axios.get("/profile/me") ;

        dispatch({
            type:USER_LOADED,
            payload: resUser.data
        })
        dispatch({
            type: GET_MY_PROFILE,
            payload: resProfile.data
        })
    }catch (e) {
        dispatch({
            type: AUTH_ERR
        })
        console.log(e)
    }
}

//Register user
export const register = (firstname, secondname, email, password) => async dispatch =>{
    const config = {
        headers:{
            "Content-Type": "application/json"
        }
    }

    const body = JSON.stringify({firstname, secondname, email, password});
    
    try {
        const res = await axios.post("/user", body, config);
        console.log(res)

        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        })

        dispatch(loadUser())
    }catch (e) {
        const errors = e.response.data.errors;
        console.log(errors);
        errors.forEach(error=>dispatch(setAlert(error.msg, "danger"))
        );
        dispatch({
            type: REGISTER_FAILED
        })
    }
}

//Login user
export const login = (email, password) => async dispatch =>{
    const config = {
        headers:{
            "Content-Type": "application/json"
        }
    }

    const body = JSON.stringify({email, password});

    try {
        const res = await axios.post("/auth", body, config);

        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        })

        dispatch(loadUser())
    }catch (e) {
        const errors = e.response.data.errors;
        console.log(errors);
        errors.forEach(error=>dispatch(setAlert(error.msg, "danger"))
        );
        dispatch({
            type: LOGIN_FAILED
        })
    }
}

//Logout
export const logout = ()=> async dispatch =>{
    dispatch({
        type: CLEAR_PROFILE
    })
    dispatch({
        type: LOGOUT
    })
}