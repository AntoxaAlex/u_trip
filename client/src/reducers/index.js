import {combineReducers} from "redux";
import alert from "./alert";
import auth from "./auth";
import profile from "./profile"
import trips from "./trips"
import comment from "./comment";

export default combineReducers({
    alert,
    auth,
    profile,
    trips,
    comment
});