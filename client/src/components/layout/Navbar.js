import React, {Fragment, useState} from 'react';
import {Link,Redirect} from "react-router-dom";
import {DropdownButton, FormControl} from "react-bootstrap";
import {connect} from "react-redux"
import {logout} from "../../actions/auth";
import PropTypes from "prop-types";

const Navbar =({auth:{isAuthenticated, loading}, logout, profile:{profile}})=>{

    const[searchedValue, setSearchedValue] = useState({
        value: null,
        isSubmitted: false
    })
    const onSubmitSearch = (e) =>{
        e.preventDefault()
        setSearchedValue({...searchedValue,isSubmitted: true})
    }

    if(searchedValue.isSubmitted){
        return <Redirect to={"/n/search/"+searchedValue.value}/>
    }

    const authLinks = (
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav ml-auto">
            <form onSubmit={(e)=>onSubmitSearch(e)} >
                <FormControl type="text" placeholder="Search" className=" mr-sm-2" size="sm" onChange={(e)=>setSearchedValue({...searchedValue,value: e.target.value})}/>
            </form>
            <img alt="" src={profile === null ? "https://meetanentrepreneur.lu/wp-content/uploads/2019/08/profil-linkedin-300x300.jpg": profile.imageUrl} style={{width: "40px", height: "40px"}} className="rounded-circle"/>
            <DropdownButton variant="link" id="dropdown-button" size="sm" title="">
                <Link className="nav-link mt-2" to="/n/dashboard">See profile</Link>
                <Link to="/n/profile/edit" className="nav-link">Edit Profile</Link>
            </DropdownButton>
            <li className="nav-item">
                <Link className="nav-link" to="#!" onClick={logout}><i className="fas fa-sign-out-alt"></i></Link>
            </li>
        </ul>
    </div>

    );
    const guestLinks = (
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav">
                <li className="nav-item">
                    <Link className="nav-link" to="/n/auth/signin">SignIn</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/n/auth/signup">Register</Link>
                </li>
            </ul>
        </div>
    );
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-transparent fixed-top">
            <Link className="navbar-brand" to="/n/home"><span>y</span>trip</Link>
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
    auth: state.auth,
    profile: state.profile
})

export default connect(mapStateToProps,{logout})(Navbar);