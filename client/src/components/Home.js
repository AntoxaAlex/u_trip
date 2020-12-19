import React, {useEffect, useState, Fragment }from 'react';
import {connect} from "react-redux";
import {getAllProfiles, getCurrentProfile} from "../actions/profile";
import {getAllTrips, getCurrentTrip,completeTrip, confirmTrip} from "../actions/trips";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";

const Home = ({getAllProfiles, getCurrentProfile, getAllTrips, getCurrentTrip, completeTrip,confirmTrip, trips, profile}) => {

    const[nearTripsArr, setNearTrips] = useState([])
    const[currentPosition, setCurrentPosition] = useState({
        lat: "",
        lng: ""
    })
    const[bestTripsArr, setBestTrips] = useState([])
    const[bestUsersArr, setBestUsers] = useState([])

    const calculateDistance = (lat1, lat2, lng1, lng2, r) =>{

        const res =  Math.acos((Math.sin(lat1 *(Math.PI / 180)) * Math.sin(lat2 *(Math.PI / 180))) +
            (Math.cos(lat1 *(Math.PI / 180)) * Math.cos(lat2 *(Math.PI / 180)) * Math.cos((lng1 *(Math.PI / 180)) - (lng2 *(Math.PI / 180))))
        )*r
        return res

    }

    useEffect(()=>{
        getCurrentProfile()
        getAllProfiles()
        getAllTrips()
        getCurrentTrip()
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) =>{
                setCurrentPosition({...currentPosition,lat: parseFloat(position.coords.latitude), lng: parseFloat(position.coords.longitude)})
            });
        } else {
            console.log("Geolocation is not supported by this browser.");
        }

        if(currentPosition.lat !== "" && currentPosition.lng !== ""){
            const nearTrips = trips.trips.filter(trip=> calculateDistance(parseFloat(trip.st_point.sp_latitude), currentPosition.lat, parseFloat(trip.st_point.sp_longitude), currentPosition.lng, 6371) < 500)
            setNearTrips(nearTrips)
        }
        const bestTrips = trips.trips.sort((a,b)=>{
            if(a.generalRating > b.generalRating) return -1;
            if(a.generalRating < b.generalRating) return 1;
            return 0
        })
        setBestTrips(bestTrips)

        const bestUsers = profile.profiles.sort((a,b)=>{
            if(a.level > b.level) return -1;
            if(a.level < b.level) return 1;
            return 0
        })
        setBestUsers(bestUsers)
    },[trips.loading, profile.loading, getCurrentProfile,getCurrentTrip,getAllTrips,getAllProfiles])

    return (
        <Fragment>
            {trips.trips && !trips.loading  ? (
                <Fragment>
                    {profile.profiles && !profile.loading ? (
                        <div id="mainHomeDiv" className="p-0">
                            <div id="introDiv">
                                {profile.profile && trips.status === "not ready" && <Fragment>
                                    <h1 id="introHeader">Confirm the trip</h1>
                                    <button
                                        type="button"
                                        className="btn btn-outline-danger"
                                        style={{width: "250px", height: "40px", borderRadius: "20px"}}
                                        onClick={()=>confirmTrip(trips.trip)}
                                    >Confirm</button>
                                </Fragment>}
                                {profile.profile && trips.status === "you ready" && !trips.trip.isTripReady && <Fragment>
                                    <h1 id="introHeader">Wait other people</h1>
                                   <div className="row">
                                       {trips.trip.team.map((teammate,i)=>{
                                           return(
                                               <div key={i} className="col-2">
                                                   <img
                                                       alt=""
                                                       src={teammate.imageUrl}
                                                       className="rounded-circle"
                                                       style={{
                                                           width: "100px",
                                                           height: "100px",
                                                           opacity: teammate.isReady ? "1" : "0.5"
                                                       }}
                                                   />
                                               </div>
                                           )
                                       })}
                                   </div>
                                </Fragment>}
                                {profile.profile && trips.currentTrip && !trips.status && <Fragment>
                                    <h1 id="introHeader">Return to trip</h1>
                                    <Link to={"/n/trips/show/"+trips.currentTrip._id} className="btn btn-outline-danger" style={{width: "250px", height: "40px", borderRadius: "20px"}}><h5>{trips.currentTrip.title}</h5></Link>
                                </Fragment>}
                                {profile.profile && !trips.currentTrip && !trips.status && <Fragment>
                                    <h1 id="introHeader">Start new journey</h1>
                                    <Link to="/n/trips/new" className="btn btn-outline-danger" style={{width: "250px", height: "40px", borderRadius: "20px"}}><h5>Create new trip</h5></Link>
                                </Fragment>}
                                {!profile.profile && !trips.status && <Fragment>
                                    <h1 id="introHeader">Be a part of us</h1>
                                    <Link to="/n/profile/new" className="btn btn-outline-danger" style={{width: "250px", height: "40px", borderRadius: "20px"}}><h5>Create profile</h5></Link>
                                </Fragment>}
                            </div>
                            <div id="homeDivContent" className="p-3">
                                {nearTripsArr.length > 0 && <Fragment>
                                    <h5>Trips near you</h5>
                                    <div id="tripsNearYou">
                                        <div className="row">
                                            {(bestTripsArr.filter((trip,i)=>i<6)).map((trip,i)=>{
                                                return(
                                                    <div key={i} className="col-4">
                                                        <p>{trip.title}</p>
                                                        <img alt="" src={trip.fn_destination.fd_image} style={{width: "100px", height: "100px"}}/>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </Fragment>}
                                {bestTripsArr.length > 0 && <Fragment>
                                    <h5>Best trips</h5>
                                    <div id="bestTripsDiv">
                                        <div className="row">
                                            {(bestTripsArr.filter((trip,i)=>i<6)).map((trip,i)=>{
                                                return(
                                                    <div key={i} className="col-4">
                                                        <p>{trip.title}</p>
                                                       <img alt="" src={trip.st_point.sp_image} style={{width: "100px", height: "100px"}}/>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </Fragment>}
                                {bestUsersArr.length > 0 && <Fragment>
                                    <h5>Best users</h5>
                                    <div id="bestUsersDiv">
                                        <div className="row">
                                            {(bestUsersArr.filter((user,i)=>i<6)).map((user,i)=>{
                                                return(
                                                    <div key={i} className="col-4">
                                                        <p>{user.user.firstname}</p>
                                                        <img alt="" src={user.imageUrl} style={{width: "100px", height: "100px"}}/>
                                                        <p>{user.level}</p>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </Fragment>}
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
export default connect(mapStateToProps, {getAllProfiles, getAllTrips, getCurrentProfile, getCurrentTrip, completeTrip,confirmTrip})(Home);