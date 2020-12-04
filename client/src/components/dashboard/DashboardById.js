import React, {useEffect, useState, Fragment} from "react";
import {Link} from "react-router-dom"
import {connect} from "react-redux";
import Spinner from "../layout/Spinner";
import {getProfileById} from "../../actions/profile";
import {getAllUserTrips, getUserCurrentTrip} from "../../actions/trips";
import PropTypes from "prop-types";
import {DropdownButton, InputGroup, Carousel} from "react-bootstrap";
import {useParams} from "react-router";

const DashboardById = ({getProfileById, getAllUserTrips, getUserCurrentTrip, completeTrip, removeTrip, setProfileStatus, auth, profile:{profile, loading}, trips:{trips, currentTrip}}) => {
    const {id} = useParams()
    useEffect(()=>{
        getProfileById(id)
        getUserCurrentTrip(id)
        getAllUserTrips(id)
    },[loading])

    const [profileStatus, setPrStatus] =useState({
        status: ""
    })

    const [displayLinks, setDisplay] =useState(false)


    return(
        <Fragment>
            {profile === null && loading && auth.loading ? <Spinner/> : (
                <Fragment>
                    {profile !== null && auth.user!==null ? (
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
                                                    <i className={preference.iconClass}/>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                                <div id="secondColumn" className="col-9">
                                    <div id="nameBox">
                                        <p id="dashboardName">{auth.user.firstname} {auth.user.secondname}</p>
                                        <InputGroup size="sm" className="mb-3" style={{width: "40%"}}>
                                            <p id="statusString" style={{width: "140px", color: profile.status === "in trip" ? "green" : (profile.status === "ready for trip" ? "orange": "red")}}>
                                                {profile.status}
                                            </p>

                                            <DropdownButton
                                                menuAlign="right"
                                                as={InputGroup.Append}
                                                variant="outline-light"
                                                id="input-group-dropdown-2"
                                            >

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
                                        {trips ===null && loading ? <Spinner/> : (
                                            <Fragment>
                                                <ul className="nav nav-tabs">
                                                    <li className="nav-item">
                                                        <Link className="nav-link active" to="#">{profile.username}'s trips</Link>
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
                                                <Fragment>
                                                    {trip.team.map((teammate, i)=>{
                                                        return(
                                                            <Link to="#">
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
                            <p>You have not yet setup a profile, please add some info</p>
                            <Link to="/n/profile/new" className="btn btn-primary my-1">
                                Create Profile
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

DashboardById.propTypes = {
    getProfileById: PropTypes.func.isRequired,
    getUserCurrentTrip: PropTypes.func.isRequired,
    getAllUserTrips: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    trips: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    profile: state.profile,
    trips: state.trips
})

export default connect(mapStateToProps, {getProfileById, getUserCurrentTrip, getAllUserTrips})(DashboardById);