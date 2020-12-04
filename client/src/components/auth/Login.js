import React, {useState} from 'react';
import {Link, Redirect} from "react-router-dom";
import {connect} from "react-redux";
import {login} from "../../actions/auth";
import PropTypes from "prop-types";

const Login = ({login, isAuthenticated}) =>{
    const[formData, setFormData]= useState({
        email: "",
        password: ""
    })

    const {email, password} = formData;

    const onChange = e => setFormData({...formData, [e.target.name]: e.target.value});
    const onSubmit = async e =>{
        e.preventDefault();
        login(email, password)
    }

    if(isAuthenticated){
        return <Redirect to="/n/home"/>
    }
    return (
        <React.Fragment>
            <h1 className="large display-4">Sign In</h1>
            <p className="lead mb-5">
                Sign Into Your Account
            </p>
            <div className="signIn_registerDiv">
                <form className="form" onSubmit={e=>onSubmit(e)}>
                    <div className="form-group">
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Email Address"
                            autoComplete="off"
                            name="email"
                            value={email}
                            onChange={(e)=>onChange(e)}
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Password"
                            name="password"
                            value={password}
                            onChange={(e)=>onChange(e)}
                            minLength="5"
                        />
                    </div>
                    <input type="submit" className="btn btn-primary" value="Login" />
                </form>
                <p className="my-1">
                    Don't have an account? <Link to="/n/auth/signup">Sign Up</Link>
                </p>
            </div>
        </React.Fragment>
    );
}

Login.propTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
}

const mapStateToProps = state =>({
    isAuthenticated: state.auth.isAuthenticated
})
export default connect(mapStateToProps,{login})(Login);