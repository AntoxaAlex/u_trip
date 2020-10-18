import React, {Fragment} from 'react';
import {Link} from "react-router-dom";
import {connect} from "react-redux"
import {logout} from "../../actions/auth";
import PropTypes from "prop-types";

const Navbar =({auth:{isAuthenticated, loading}, logout})=>{
    const authLinks = (
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
                <Link className="nav-link" to="/trips/home">Home <span className="sr-only">(current)</span></Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link" to="/dashboard">Dashboard</Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link" to="/trips/new">New</Link>
            </li>
        </ul>
        <ul className="navbar-nav">
            <li className="nav-item">
                <Link className="nav-link" to="#!" onClick={logout}>Logout</Link>
            </li>
        </ul>
    </div>

    );
    const guestLinks = (
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav">
                <li className="nav-item">
                    <Link className="nav-link" to="/auth/signin">SignIn</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/auth/signup">Register</Link>
                </li>
            </ul>
        </div>
    );
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link className="navbar-brand" to="/">Navbar</Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse"
                    data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                    aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            {!loading && (<Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>)}
        </nav>
    );
}

Navbar.propTypes = {
    logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
}

const mapStateToProps = state =>({
    auth: state.auth
})

export default connect(mapStateToProps,{logout})(Navbar);