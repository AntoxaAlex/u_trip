import React from 'react';
import {Link} from "react-router-dom";

const Landing = () =>{
    return (
        <div className="landing">
            <video autoPlay="autoplay" muted loop="loop" id="landing_video">
                <source src="https://res.cloudinary.com/antoxaalex/video/upload/v1608683803/backgrounds/Mountains_-_56592_ozn2se.mp4" type="video/mp4"/>
            </video>
            <div className="landing-header fade-in">
                <h1>Welcome to yTrip!</h1>
                <Link className="btn btn-primary btn-lg" to="/n/home">Get started</Link>
            </div>

        </div>
    );
}


export default Landing;