import React, {useEffect, useState, Fragment }from 'react';
import {connect} from "react-redux";
import {getAllProfiles, getCurrentProfile} from "../actions/profile";
import {getAllTrips, getCurrentTrip,confirmTrip,getNearestTrips} from "../actions/trips";
import Spinner from "./layout/Spinner";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import ReactStars from "react-rating-stars-component";
import moment from "moment";

const Home = ({getAllProfiles, getCurrentProfile, getAllTrips,getNearestTrips, getCurrentTrip,confirmTrip, trips, profile, auth}) => {

    const[currentPosition, setCurrentPosition] = useState({
        lat: "",
        lng: ""
    })

    const calculateDistance = (lat1, lat2, lng1, lng2, r) =>{

        return Math.acos((Math.sin(lat1 *(Math.PI / 180)) * Math.sin(lat2 *(Math.PI / 180))) +
            (Math.cos(lat1 *(Math.PI / 180)) * Math.cos(lat2 *(Math.PI / 180)) * Math.cos((lng1 *(Math.PI / 180)) - (lng2 *(Math.PI / 180))))
        )*r

    }

    useEffect(()=>{
        getCurrentProfile()
        getCurrentTrip()
        getAllProfiles()
        getAllTrips()
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) =>{
                setCurrentPosition({...currentPosition,lat: parseFloat(position.coords.latitude), lng: parseFloat(position.coords.longitude)})
            });
        }
    },[])

    useEffect(()=>{
        if(currentPosition.lat !== "" && currentPosition.lat !== ""){
            getNearestTrips(currentPosition.lat, currentPosition.lng)
        }
    },[currentPosition.lat, currentPosition.lng, getNearestTrips])

    return (
        <Fragment>
            {!trips.loading && !auth.loading ? (
                <div id="mainHomeDiv" className="p-0">
                    <header>
                        <div id="introDiv">
                            {profile.profile && trips.status === "not ready" && !trips.trip.isTripReady && <Fragment>
                                <h1 id="introHeader" style={{marginBottom: "0"}}>Confirm the trip</h1>
                                <div className="introDivBtn">
                                    <button
                                        type="button"
                                        className="bg-transparent border-0 "
                                        onClick={()=>confirmTrip(trips.trip)}
                                    ><h5>Confirm</h5></button>
                                </div>
                            </Fragment>}
                            {trips.status === "you ready" && !trips.loading && !trips.trip.isTripReady && <Fragment>
                                <h1 id="introHeader" style={{marginBottom: "0"}}>Wait other people</h1>
                                <div id="showTripTeamDiv" style={{gridTemplateColumns: `repeat(${trips.trip.team.length}, calc(20%))`}}>
                                    {trips.trip.team.map((teammate,i)=>{
                                        return(
                                            <div key={i} className="friendItem">
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
                            {!profile.loading && profile.profile && trips.currentTrip && !trips.status && <Fragment>
                                <h1 id="introHeader">Return to trip</h1>
                                <div className="introDivBtn">
                                    <Link to={"/n/trips/show/"+trips.currentTrip._id}><h5>{trips.currentTrip.title}</h5></Link>
                                </div>
                            </Fragment>}
                            {!profile.loading && profile.profile && !trips.loading && !trips.currentTrip && !trips.status && <Fragment>
                                <h1 id="introHeader">Start new journey</h1>
                                <div className="introDivBtn">
                                    <Link to="/n/trips/new"><h5>Create new trip</h5></Link>
                                </div>
                            </Fragment>}
                            {!profile.loading && !profile.profile && !trips.currentTrip && !trips.status && <Fragment>
                                <h1 id="introHeader">Be a part of us</h1>
                                <div className="introDivBtn">
                                    <Link to="/n/auth/signup"><h5>Create profile</h5></Link>
                                </div>
                            </Fragment>}
                        </div>
                    </header>
                    {!profile.loading && !trips.loading && <main>
                        <div id="homeDivContent" className="p-3">
                            {trips.nearestTrips ? (<Fragment>
                                <div id="tripsNearYouContainer">
                                    <h2 className="homeContentHeader">Trips near you</h2>
                                    <div id="tripsNearYou">
                                        {trips.nearestTrips && trips.nearestTrips.map((trip,i)=>{
                                            return(
                                                <div key={i} className="nearTripsGridItem">
                                                    <img src={trip.st_point.sp_image} style={{width: "100px", height: "100px", borderRadius: "15px", marginRight: "10px"}} alt="..."/>
                                                    <div className="tripsInformation">
                                                        <h5 className="card-title">
                                                            <Link className="nav-link text-secondary" to={"/n/trips/show/"+trip._id}>{trip.title}</Link>
                                                        </h5>
                                                        <p className="card-text"><small
                                                            className="text-muted">{parseInt(calculateDistance(parseFloat(trip.st_point.sp_latitude), currentPosition.lat, parseFloat(trip.st_point.sp_longitude), currentPosition.lng, 6371))} km from you</small></p>

                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </Fragment>) : null}
                            {!profile.loading && profile.profiles? (<Fragment>
                                <div id="bestUsersContainer">
                                    <h2 className="homeContentHeader">Best users</h2>
                                    <div id="bestUsersDiv">
                                        {profile.profiles.sort((a,b)=>{
                                            if(a.level > b.level) return -1;
                                            if(a.level < b.level) return 1;
                                            return 0
                                        }).filter((user,i)=>i<6).map((user,i)=>{
                                            return(
                                                <div key={i} className="userGridItem">
                                                    <img src={user.imageUrl} className="rounded-circle" style={{width: "100px", height: "100px", border: "green", marginBottom: "40px"}} alt="..."/>
                                                    {i<3 && <img alt="" src={
                                                        i=== 0 ? "https://res.cloudinary.com/antoxaalex/image/upload/v1609703106/backgrounds/medal-1622523_1280_wxji7z.png" : (
                                                            i === 1 ? "https://res.cloudinary.com/antoxaalex/image/upload/v1609703118/backgrounds/medal-1622529_1280_swgnk4.png" : (
                                                                i === 2 ? "https://res.cloudinary.com/antoxaalex/image/upload/v1609703115/backgrounds/medal-1622549_1280_xynwxz.png" : null
                                                            )
                                                        )
                                                    } className="medalImage"/>}
                                                    <div className="userInformation">
                                                        <table>
                                                            <tbody>
                                                            <tr>
                                                                <td><strong>Name:</strong></td>
                                                                <td><Link className="nav-link d-inline text-info" to={`/n/dashboard/${auth.user && auth.user._id !== user.user._id ? user.user._id : ""}`}>{user.user.firstname}</Link></td>
                                                            </tr>
                                                            <tr>
                                                                <td><strong>Dob:</strong></td>
                                                                <td className="userTableTd">{moment(user.dob).format("MM-DD-YYYY")}</td>
                                                            </tr>
                                                            <tr>
                                                                <td><strong>Gender:</strong></td>
                                                                <td className="userTableTd">{user.gender}</td>
                                                            </tr>
                                                            <tr>
                                                                <td><strong>Level:</strong></td>
                                                                <td className="userTableTd"><strong className="levelSpan">{user.level}</strong></td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </Fragment>): null}
                            {!trips.loading && trips.trips ? (<Fragment>
                                <div id="bestTripsContainer">
                                    <h2 className="homeContentHeader">Best trips</h2>
                                    <div id="bestTripsDiv">
                                        {(trips.trips.sort((a,b)=>{
                                            if(a.generalRating > b.generalRating) return -1;
                                            if(a.generalRating < b.generalRating) return 1;
                                            return 0
                                        }).filter((trip,i)=>i<6)).map((trip,i)=>{
                                            return(
                                                <div key={i} className="tripsGridItem mb-3">
                                                    <img src={trip.st_point.sp_image} style={{width: "100%", borderRadius: "15px 15px 0 0"}} alt="..."/>

                                                    <div className="tripsInformation" style={{width: "100%"}}>
                                                        <h5 className="text-center">
                                                            <Link className="nav-link text-white" to={"/n/trips/show/"+trip._id}>{trip.title}</Link>
                                                        </h5>
                                                        <div style={{width: "100%", padding: "10px 20px"}}>
                                                            <small className="float-left">
                                                                {trip.isCompleted && trip.st_point.departureDate && trip.fn_destination.arrivalDate ? `Duration: ${Math.floor(moment.duration( moment(trip.fn_destination.arrivalDate).diff(moment(trip.st_point.departureDate))).asDays())} days`
                                                                    : "In progress"}
                                                            </small>
                                                            <small className="float-right">
                                                                <ReactStars
                                                                    className="my-5"
                                                                    value={trip.generalRating}
                                                                    count={5}
                                                                    size={20}
                                                                    activeColor="#ffd700"
                                                                    isHalf={true}
                                                                    emptyIcon={<i className="far fa-star"/>}
                                                                    halfIcon={<i className="fas fa-star-half"/>}
                                                                    fullIcon={<i className="fas fa-star"/>}
                                                                />
                                                            </small>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </Fragment>): <Spinner/>}
                        </div>
                    </main>}
                    <footer>
                        <div id="bottomDiv">
                            <Link id="aboutLink" to="#">About</Link>
                            <div id="contacts">
                                <strong>Contacts</strong>
                                <p>Tel: +380XXXXXXXXX</p>
                                <p>Email: y-trip@xxx.com</p>
                            </div>
                            <div id="socialMedia">
                                <strong>Social Media</strong>
                                <div id="socialLinks">
                                    <a href="!#" rel="noopener noreferrer"><i className="fab fa-instagram"/></a>
                                    <a href="!#" rel="noopener noreferrer"><i className="fab fa-facebook-f"/></a>
                                    <a href="!#" rel="noopener noreferrer"><i className="fab fa-vk"/></a>
                                    <a href="!#" rel="noopener noreferrer"><i className="fab fa-pinterest-p"/></a>
                                </div>
                            </div>
                        </div>
                    </footer>
                </div>
            ) : null}
        </Fragment>
    );
}

Home.propTypes = {
    trips: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    getCurrentProfile: PropTypes.func.isRequired,
    getNearestTrips: PropTypes.func.isRequired,
    getAllProfiles: PropTypes.func.isRequired,
    getAllTrips: PropTypes.func.isRequired,
    getCurrentTrip: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    trips: state.trips,
    profile: state.profile,
    auth: state.auth
})
export default connect(mapStateToProps, {getAllProfiles, getAllTrips, getCurrentProfile, getCurrentTrip,confirmTrip,getNearestTrips})(Home);