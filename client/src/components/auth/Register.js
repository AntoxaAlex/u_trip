import React, {useState} from 'react';
import {connect} from "react-redux";
import {Link, Redirect} from "react-router-dom";
import {setAlert} from "../../actions/alert";
import {register} from "../../actions/auth";
import PropTypes from "prop-types";

const Register = ({setAlert, register, isAuthenticated})=>{
    const[formData, setFormData]= useState({
        firstname: "",
        secondname: "",
        email: "",
        password: "",
        password2: ""
    })

    const {firstname, secondname, email, password, password2} = formData;

    const onChange = e => setFormData({...formData, [e.target.name]: e.target.value})
    const onSubmit = async e =>{
        e.preventDefault();
        if(password !== password2){
            setAlert("Passwords do not match","danger");
        } else {
            register(firstname, secondname, email, password);
        }
    }

    if(isAuthenticated){
        return <Redirect to="/n/home"/>
    }

    return (
        <div>
            <h1 className="large display-4">Sign Up</h1>
            <p className="lead">
                Create Your Account
            </p>
            <div className="signIn_registerDiv">
            <form className="form" onSubmit={e=>onSubmit(e)}>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="First name"
                        className="form-control"
                        autoComplete="off"
                        name="firstname"
                        value={firstname}
                        onChange={(e)=>onChange(e)}
                    />
                </div>
                <div className="form-group">
                    <input
                    type="text"
                    placeholder="Second name"
                    autoComplete="off"
                    className="form-control"
                    name="secondname"
                    value={secondname}
                    onChange={(e)=>onChange(e)}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="email"
                        placeholder="Email Address"
                        className="form-control"
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
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Confirm Password"
                        name="password2"
                        value={password2}
                        onChange={(e)=>onChange(e)}
                    />
                </div>
                <input type="submit" className="btn btn-primary" value="Register"/>
            </form>
            </div>
            <p className="my-1">
                Already have an account? <Link to="/n/auth/signin">Sign In</Link>
            </p>
        </div>
    );
}

Register.propTypes = {
    setAlert: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
}

const mapStateToProps = state =>({
    isAuthenticated: state.auth.isAuthenticated
})


export default connect(mapStateToProps, {setAlert, register})(Register);