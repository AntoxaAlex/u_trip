import React from 'react';
import {Link} from "react-router-dom";

const Landing = () =>{
    return (
        <div className="landing">
            <div id="video_background">
                <video autoPlay="autoplay" muted loop="loop" id="landing_video">
                    <source src="https://res.cloudinary.com/antoxaalex/video/upload/v1605278069/backgrounds/190915_B_02_HaLong_33_kgzjpm.mp4" type="video/mp4"/>
                </video>
            </div>
            <div className="landing-header fade-in">
                <h1>Welcome to yTrip!</h1>
                <Link className="btn btn-primary btn-lg" to="/n/home">Get started</Link>
            </div>

        </div>
    );
}


export default Landing;