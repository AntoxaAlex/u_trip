import React, {useEffect, useState, Fragment }from 'react';
import {connect} from "react-redux";
import {getAllProfiles, getCurrentProfile} from "../actions/profile";
import {getAllTrips, getCurrentTrip,completeTrip} from "../actions/trips";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";

const Home = ({getAllProfiles, getCurrentProfile, getAllTrips, getCurrentTrip, completeTrip, trips, profile}) => {
    useEffect(()=>{
        getCurrentProfile()
        getAllProfiles()
        getAllTrips()
        getCurrentTrip()
    },[])

    return (
        <Fragment>
            {trips.trips && !trips.loading  ? (
                <Fragment>
                    {profile.profiles && !profile.loading ? (
                        <div id="mainHomeDiv" className="p-0">
                            <div id="introDiv">
                                {profile.profile && trips.currentTrip && <Fragment>
                                    <h1 id="introHeader">Return to trip</h1>
                                    <Link to={"/n/trips/show/"+trips.currentTrip._id} className="btn btn-outline-danger" style={{width: "250px", height: "40px", borderRadius: "20px"}}><h5>{trips.currentTrip.title}</h5></Link>
                                </Fragment>}
                                {profile.profile && !trips.currentTrip && <Fragment>
                                    <h1 id="introHeader">Start new journey</h1>
                                    <Link to="/n/trips/new" className="btn btn-outline-danger" style={{width: "250px", height: "40px", borderRadius: "20px"}}><h5>Create new trip</h5></Link>
                                </Fragment>}
                                {!profile.profile && <Fragment>
                                    <h1 id="introHeader">Be a part of us</h1>
                                    <Link to="/n/profile/new" className="btn btn-outline-danger" style={{width: "250px", height: "40px", borderRadius: "20px"}}><h5>Create profile</h5></Link>
                                </Fragment>}
                            </div>
                            <div id="homeDivContent" className="p-3">
                                <h5>Trips near you</h5>
                                <div id="tripsNearYou">

                                </div>
                                <h5>Best trips</h5>
                                <div id="bestTripsDiv">

                                </div>
                                <h5>Best users</h5>
                                <div id="bestUsersDiv">

                                </div>
                            </div>
                            <div id="bottomDiv">

                            </div>
                        </div>
                    ) : null}
                </Fragment>
            ):null}
        </Fragment>
    );
}

Home.propTypes = {
    trips: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    getCurrentProfile: PropTypes.func.isRequired,
    getAllProfiles: PropTypes.func.isRequired,
    getAllTrips: PropTypes.func.isRequired,
    completeTrip: PropTypes.func.isRequired,
    getCurrentTrip: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    trips: state.trips,
    profile: state.profile
})
export default connect(mapStateToProps, {getAllProfiles, getAllTrips, getCurrentProfile, getCurrentTrip, completeTrip})(Home);