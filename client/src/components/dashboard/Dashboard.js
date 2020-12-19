import React, {useEffect, useState, Fragment} from "react";
import {Link, Redirect} from "react-router-dom"
import {connect} from "react-redux";
import Spinner from "../layout/Spinner";
import {getCurrentProfile, changeTab, setProfileStatus} from "../../actions/profile";
import {getAllMyTrips, removeTrip, getCurrentTrip, completeTrip} from "../../actions/trips";
import PropTypes from "prop-types";
import {DropdownButton, InputGroup, Carousel} from "react-bootstrap";

const Dashboard = ({getCurrentProfile, getAllMyTrips, getCurrentTrip, completeTrip, removeTrip, setProfileStatus, auth, profile:{profile, loading}, trips:{trips, currentTrip}}) => {
    useEffect(()=>{
        getCurrentProfile()
        getCurrentTrip()
        getAllMyTrips()
    },[loading, trips.loading])

    const [profileStatus, setPrStatus] =useState({
        status: ""
    })

    const [displayLinks, setDisplay] =useState(false)

    const[selectedIcon, setIconTip] = useState(null)



    const addStatus = (status) =>{
        setProfileStatus(status)
        setPrStatus({...profileStatus, status})
        document.getElementById("statusString").textContent = status
        if(status === "in trip"){
            document.getElementById("statusString").style.color = "green"
        }else if(status === "ready for trip"){
            document.getElementById("statusString").style.color = "orange"
        }else {
            document.getElementById("statusString").style.color = "red"
        }
    }

    const addIconTip = (index) =>{
        const activeIcon = profile.preferences.filter((preference ,i)=> i === index)
        setIconTip(activeIcon[0])
        document.getElementById("iconsTips").classList.toggle("fadeOut")
    }

    const removeIconTip = (index) =>{
        document.getElementById("iconsTips").classList.toggle("fadeOut")
    }



    return(
        <Fragment>
            {!profile && !loading && !auth.loading ? <Spinner/> : (
                <Fragment>
                    {profile && auth.user ? (
                        <div id="dashboard">
                            <div id="infoBox" className="row">
                                <div id="firstColumn" className="col-3">
                                    <div id="avatarBox">
                                        <img
                                            className="rounded-circle"
                                            src={profile.imageUrl}
                                            alt="" width="200px" height="200px"
                                        />

                                    </div>
                                    <div id="preferenceDiv" className="row p-3">
                                        {profile.preferences.map((preference, i)=>{
                                            return(
                                                <div key={i} className="col-2 p-0">
                                                    <i className={preference.iconClass} onMouseEnter={()=>addIconTip(i)} onMouseLeave={()=>removeIconTip()}/>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <div id="iconsTips" className="fadeIn">
                                        {selectedIcon && <p>{selectedIcon.value}</p>}
                                    </div>
                                </div>
                                <div id="secondColumn" className="col-9">
                                    <div id="nameBox">
                                        <p id="dashboardName">{auth.user.firstname} {auth.user.secondname}</p>
                                        <InputGroup size="sm" className="mb-3" style={{width: "40%"}}>
                                            <p id="statusString" style={{width: "140px"}}>
                                                {!profile.status ? "Set status" : profile.status}
                                            </p>

                                            <DropdownButton
                                                menuAlign="right"
                                                as={InputGroup.Append}
                                                variant="outline-light"
                                                id="input-group-dropdown-2"
                                                title=""
                                            >
                                                <button className="btn bg-transparent" onClick={()=>addStatus("in trip")}>In trip</button>
                                                <button className="btn bg-transparent" onClick={()=>addStatus("ready for trip")}>Ready for trip</button>
                                                <button className="btn bg-transparent" onClick={()=>addStatus("not ready for trip")}>Not ready for trip</button>
                                            </DropdownButton>
                                        </InputGroup>
                                    </div>
                                    <div id="mainInfo">
                                        <div className="row">
                                            <div className="col-2">
                                                <p><i className="far fa-calendar-alt"/>  Birthday</p>
                                                <p><i className="fas fa-venus-mars"/>  Gender</p>
                                                <p><i className="fas fa-user-tie"/>  Job</p>
                                                <p><i className="fas fa-map-marker-alt"/>  Location</p>
                                            </div>
                                            <div className="col-10">
                                                <p>{profile.dob}</p>
                                                <p id="gender">{profile.gender}</p>
                                                <p>{profile.job}</p>
                                                <p>{profile.place}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-primary mb-3"
                                        onClick={()=>setDisplay(!displayLinks)}
                                    >Social Networks</button>
                                    {displayLinks && <div id="socialNetDiv">
                                        <div className="row">
                                            <div className="col-2">
                                                {profile.website && <p><i className="fas fa-desktop"/>  Website</p>}
                                                {profile.instagram && <p><i className="fab fa-instagram"/>  Instagram</p>}
                                                {profile.facebook && <p><i className="fab fa-facebook-f"/> Facebook</p>}
                                                {profile.vk && <p><i className="fab fa-vk"/>  Vkontakte</p>}
                                                {profile.pinterest && <p><i className="fab fa-pinterest-p"/>  Pinterest</p>}
                                            </div>
                                            <div className="col-10">
                                                {profile.website && <p><a href={profile.website} target="_blank" rel="noopener noreferrer">{profile.website}</a></p>}
                                                {profile.instagram && <p><a href={profile.instagram} target="_blank" rel="noopener noreferrer">{profile.instagram}</a></p>}
                                                {profile.facebook && <p><a href={profile.facebook} target="_blank" rel="noopener noreferrer">{profile.facebook}</a></p>}
                                                {profile.vk && <p><a href={profile.vk} target="_blank" rel="noopener noreferrer">{profile.vk}</a></p>}
                                                {profile.pinterest && <p><a href={profile.pinterest} target="_blank" rel="noopener noreferrer">{profile.pinterest}</a></p>}
                                            </div>
                                        </div>
                                    </div>}
                                        {!currentTrip && loading ? <Spinner/> : (
                                            <div id="currentTripDiv">
                                            {currentTrip && <Fragment>
                                                <ul className="nav nav-tabs">
                                                    <li className="nav-item">
                                                        <Link className="nav-link active" to="#">Current trip</Link>
                                                    </li>
                                                </ul>
                                                <div className="card mb-4">
                                                    <div id="trip_title_div" style={{height: "150px", width: "100%", backgroundImage: "url("+currentTrip.tripImage+")", backgroundSize: "cover", backgroundPosition: "center"}}>
                                                        <h1>{currentTrip.title}</h1>
                                                    </div>
                                                    <div className="card-body">
                                                        <p className="card-text">{currentTrip.trip_description}</p>
                                                        <div className="row">
                                                            <div className="col-8">
                                                                {currentTrip.user === auth.user._id ?(<Fragment>
                                                                    <div className="edit_delete_trip_div d-inline">
                                                                        <Link to={"/n/trips/show/"+currentTrip._id} className="btn btn-outline-primary">See more</Link>
                                                                        <Link className="btn btm-sm btn-outline-warning" to={"/n/trips/edit/"+currentTrip._id} >Update</Link>
                                                                        <button
                                                                            type="button"
                                                                            className="btn btm-sm btn-outline-danger"
                                                                            onClick={()=>completeTrip(currentTrip._id)}
                                                                        >Complete trip</button>
                                                                    </div>
                                                                </Fragment>):null}
                                                            </div>
                                                            <div className="col-4 text-right">
                                                                <p>{currentTrip.comments.length} Comments</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Fragment>}
                                            </div>)}
                                    <div id="trips">
                                        {trips && loading ? <Spinner/> : (
                                            <Fragment>
                                                <ul className="nav nav-tabs">
                                                    <li className="nav-item">
                                                        <Link className="nav-link active" to="#">My trips</Link>
                                                    </li>
                                                    <li className="nav-item">
                                                        <Link to="/n/trips/new" id="createTripButton" className="nav-link btn btn-outline-success"><i className="fas fa-plus"/> Create trip</Link>
                                                    </li>
                                                </ul>
                                                {trips.length > 0  ? (
                                                    <Carousel className="mb-4">
                                                        {trips.map((trip,i)=>{
                                                            return(
                                                                    // <div key= {i} className="card col-4">
                                                                    //     <img src={trip.tripImage} className="card-img-top"
                                                                    //          alt="..."/>
                                                                    //          <div className="card-body">
                                                                    //              <h5 className="card-title">{trip.title}</h5>
                                                                    //              <p className="card-text">{trip.description}</p>
                                                                    //              <Link to={"/n/trips/show/"+trip._id} className="btn btn-primary">See more</Link>
                                                                    //              {trip.user === auth.user._id ?(<Fragment>
                                                                    //                  <div className="edit_delete_trip_div">
                                                                    //                      <Link className="btn btm-sm btn-outline-warning" to={"/n/trips/edit/"+trip._id} >Edit</Link>
                                                                    //                      <button
                                                                    //                          type="button"
                                                                    //                          className="btn btm-sm btn-outline-danger"
                                                                    //                          onClick={()=>removeTrip(trip._id)}
                                                                    //                      >Delete</button>
                                                                    //                  </div>
                                                                    //              </Fragment>):null}
                                                                    //          </div>
                                                                    // </div>
                                                                <Carousel.Item key={i}>
                                                                    <img
                                                                        className="d-block w-100"
                                                                        src={trip.tripImage}
                                                                        alt="First slide"
                                                                    />
                                                                    <Carousel.Caption>
                                                                        <h1><Link className="nav-link text-white" to={"/n/trips/show/"+trip._id}>{trip.title}</Link></h1>
                                                                        <p>{trip.trip_description.slice(0,140)+"..."}</p>
                                                                    </Carousel.Caption>
                                                                </Carousel.Item>
                                                            )
                                                            })}
                                                    </Carousel>
                                                ) : (
                                                    <div>
                                                        <p>You have not any trip</p>
                                                    </div>
                                                )}
                                            </Fragment>
                                        )}
                                    </div>
                                    <div id="allTripFriends">
                                        {trips.map((trip, i)=>{
                                            return(
                                                <Fragment key={i}>
                                                    {trip.team.map((teammate, i)=>{
                                                        return(
                                                            <Link key={i} to={"/n/dashboard/"+teammate._id}>
                                                                <img alt="" key={i+0.1} src={teammate.avatar} className="rounded-circle friendDiv" style={{width: "100px", height: "100px"}}/>
                                                            </Link>
                                                        )
                                                    })}
                                                </Fragment>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>

                        </div>
                    ) : (
                        <Fragment>
                            <Link to="/n/profile/new" className="nav-link text-center">
                                <label id="createProfileBtn">
                                    <i className="fas fa-user-plus"/>
                                    <p>Create profile</p>
                                </label>
                            </Link>
                        </Fragment>
                    )
                    }
                </Fragment>
                )
            }

        </Fragment>
    )
}

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    getCurrentTrip: PropTypes.func.isRequired,
    completeTrip: PropTypes.func.isRequired,
    getAllMyTrips: PropTypes.func.isRequired,
    changeTab: PropTypes.func.isRequired,
    setProfileStatus: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    trips: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile,
    trips: state.trips
})

export default connect(mapStateToProps, {getCurrentProfile, getCurrentTrip, changeTab, getAllMyTrips, removeTrip, setProfileStatus, completeTrip})(Dashboard);