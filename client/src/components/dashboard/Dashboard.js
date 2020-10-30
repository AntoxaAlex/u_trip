import React, {useEffect, Fragment} from "react";
import {Link} from "react-router-dom"
import {connect} from "react-redux";
import Spinner from "../layout/Spinner";
import {getCurrentProfile, changeTab} from "../../actions/profile";
import {getAllMyTrips} from "../../actions/trips";
import PropTypes from "prop-types";

const Dashboard = ({getCurrentProfile, getAllMyTrips, changeTab, auth:{user}, profile:{profile, loading, activeTab}, trips:{trip, trips,}}) => {
    useEffect(()=>{
        getCurrentProfile();
        getAllMyTrips()
    },[getCurrentProfile,getAllMyTrips])


    const onChangeTab = e => {
        changeTab(e.target.name)
    }
    return(
        <Fragment>
            {profile ===null && loading ? <Spinner/> : (
                <Fragment>
                    {profile !== null ? (
                        <div id="dashboard">
                            <div id="infoBox" className="row">
                                <div id="firstColumn" className="col-3">
                                    <div id="avatarBox">
                                        <img
                                            src={profile.imageUrl}
                                            alt="" width="200px" height="200px"
                                        />

                                    </div>
                                    <div>
                                        <div id="trips">

                                        </div>
                                        <div id="links">
                                        </div>
                                    </div>
                                </div>
                                <div id="secondColumn" className="col-9">
                                    <div id="nameBox">
                                        <p>{user.firstname} {user.secondname}</p>
                                    </div>
                                    <div id="mainInfo">
                                        <div className="row">
                                            <div className="col-2">
                                                <p><i className="far fa-calendar-alt"></i>  Birthday</p>
                                                <p><i className="fas fa-venus-mars"></i>  Gender</p>
                                                <p><i className="fas fa-user-tie"></i>  Job</p>
                                                <p><i className="fas fa-map-marker-alt"></i>  Location</p>
                                            </div>
                                            <div className="col-10">
                                                <p>{profile.dob}</p>
                                                <p id="gender">{profile.gender}</p>
                                                <p>{profile.job}</p>
                                                <p>{profile.place}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="tabs">
                                        <ul className="nav nav-tabs">
                                            <li className="nav-item">
                                                <button name="skills" className="nav-link" onClick={(e)=>onChangeTab(e)}>Skills</button>
                                            </li>
                                            <li className="nav-item">
                                                <button name="links" className="nav-link" onClick={(e)=>onChangeTab(e)}>Links</button>
                                            </li>
                                        </ul>
                                        <div id="addition-container">
                                            {activeTab === "skills" ? (
                                                <Fragment>
                                                    <div className="row">
                                                        <div className="col-2">
                                                            <p><i className="fas fa-skiing"></i>  Preferences</p>
                                                            <p><i className="far fa-clock"></i>  Days in trip</p>
                                                        </div>
                                                        <div className="col-10">
                                                            <p>{profile.preferences.map(preference=>{
                                                                return (preference+ ", ")
                                                            })}</p>
                                                            <p>{profile.tripdays}</p>

                                                        </div>
                                                    </div>
                                                </Fragment>
                                            ): (
                                                <Fragment>
                                                    <div className="row">
                                                        <div className="col-2">
                                                            <p><i className="fas fa-desktop"></i>  Website</p>
                                                            <p><i className="fab fa-instagram"></i>  Instagram</p>
                                                            <p><i className="fab fa-facebook-f"></i> Facebook</p>
                                                            <p><i className="fab fa-vk"></i>  Vkontakte</p>
                                                            <p><i className="fab fa-pinterest-p"></i>  Pinterest</p>
                                                        </div>
                                                        <div className="col-10">
                                                            <p><Link to={user.email}>{user.email}</Link></p>
                                                            <p><Link to={profile.instagram}>{profile.instagram}</Link></p>
                                                            <p><Link to={profile.facebook}>{profile.facebook}</Link></p>
                                                            <p><Link to={profile.vk}>{profile.vk}</Link></p>
                                                            <p><Link to={profile.pinterest}>{profile.pinterest}</Link></p>
                                                        </div>
                                                    </div>
                                                </Fragment>
                                            )}
                                        </div>
                                    </div>
                                    <div id="trips">
                                        {trips ===null && loading ? <Spinner/> : (
                                            <Fragment>
                                                {trips.length > 0  ? (
                                                    <div className="row">
                                                        {trips.map((trip,i)=>{
                                                            return(
                                                                <div key= {i} className="card col-4">
                                                                    <img src={trip.tripImage} className="card-img-top"
                                                                         alt="..."/>
                                                                         <div className="card-body">
                                                                             <h5 className="card-title">{trip.title}</h5>
                                                                             <p className="card-text">{trip.description}</p>
                                                                             <Link to={"/trips/show/"+trip._id} className="btn btn-primary">See more</Link>
                                                                         </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <p>You have not any trip</p>
                                                    </div>
                                                )}
                                            </Fragment>
                                        )}
                                    </div>
                                </div>
                            </div>

                        </div>
                    ) : (
                        <Fragment>
                            <p>You have not yet setup a profile, please add some info</p>
                            <Link to="/profile/new" className="btn btn-primary my-1">
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

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    changeTab: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    trips: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile,
    trips: state.trips
})

export default connect(mapStateToProps, {getCurrentProfile, changeTab, getAllMyTrips})(Dashboard);