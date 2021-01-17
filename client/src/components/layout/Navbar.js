import React, {Fragment, useState} from 'react';
import {Link,Redirect} from "react-router-dom";
import {DropdownButton, FormControl, Navbar, Nav} from "react-bootstrap";
import {connect} from "react-redux"
import {logout} from "../../actions/auth";
import PropTypes from "prop-types";

const NavbarComponent =({auth:{isAuthenticated, loading}, logout, profile:{myProfile}})=>{

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
        <Nav className="ml-auto">
            <form className="mr-2 mb-2" style={{margin: "10px"}} onSubmit={(e)=>onSubmitSearch(e)} >
                <FormControl type="text" placeholder="Search" size="sm" onChange={(e)=>setSearchedValue({...searchedValue,value: e.target.value})}/>
            </form>
            <div className="d-flex pt-1">
                <img alt="" src={myProfile === null ? "https://meetanentrepreneur.lu/wp-content/uploads/2019/08/profil-linkedin-300x300.jpg": myProfile.imageUrl} style={{width: "40px", height: "40px"}} className="rounded-circle"/>
                <DropdownButton variant="link" id="dropdown-button" size="sm" title="" bg="transparent" menuAlign={{ lg: 'right' }} >
                    <Link className="signLinks" to="/n/dashboard">See profile</Link>
                    <Link to="/n/profile/edit" className="signLinks d-block">Edit Profile</Link>
                </DropdownButton>
            </div>
            <Link className="signLinks" to="#" onClick={logout}><i className="fas fa-sign-out-alt"/></Link>
        </Nav>

    );
    const guestLinks = (
            <Nav className="ml-auto">
                <Link className="signLinks" to="/n/auth/signin">SignIn</Link>
                <Link className="signLinks" to="/n/auth/signup">Register</Link>
            </Nav>
    );
    return (
    <Navbar collapseOnSelect expand="lg" bg="transparent" variant="light" fixed="top">
        <Navbar.Brand href="/n/home" className="text-dark"><span>y</span>Trip</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
            {!loading && (<Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>)}
        </Navbar.Collapse>
    </Navbar>
    );
}

NavbarComponent.propTypes = {
    logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
}

const mapStateToProps = state =>({
    auth: state.auth,
    profile: state.profile
})

export default connect(mapStateToProps,{logout})(NavbarComponent);