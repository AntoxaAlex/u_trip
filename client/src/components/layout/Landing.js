import React from 'react';
import {Link} from "react-router-dom";

const Landing = () =>{
    return (
        <div className="landing">
            <div className="landing-header">
                <h1>Welcome to yTrip!</h1>
                <Link className="btn btn-primary btn-lg" to="/trips/home">List of trips</Link>
            </div>
            <ul className="slideshow">
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
            </ul>
        </div>
    );
}


export default Landing;