import React, {Component} from 'react';
import {Link} from "react-router-dom";

class Login extends Component {
    render() {
        return (
            <React.Fragment>
                <h1 className="large text-primary">Sign In</h1>
                <p className="lead">
                    <i className="fas fa-user" /> Sign Into Your Account
                </p>
                <form className="form" >
                    <div className="form-group">
                        <input
                            type="email"
                            placeholder="Email Address"
                            name="email"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            minLength="6"
                        />
                    </div>
                    <input type="submit" className="btn btn-primary" value="Login" />
                </form>
                <p className="my-1">
                    Don't have an acco unt? <Link to="/auth/register">Sign Up</Link>
                </p>

            </React.Fragment>
        );
    }
}

export default Login;