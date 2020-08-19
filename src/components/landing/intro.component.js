import React, {Component} from 'react';
import {Link} from "react-router-dom";

class Intro extends Component {
    render() {
        return (
            <div className="intro-container">
                <Link className="btn btn-primary btn-lg" to="/trips/home">List of trips</Link>
            </div>
        );
    }
}

export default Intro;