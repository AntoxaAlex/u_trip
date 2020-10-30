import React, {Fragment, useEffect} from 'react';
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {getTripById} from "../../actions/trips";
import {useParams} from "react-router";
import TripMap from "../map/TripMap";

const ShowTrip = ({getTripById, trips:{trip}}) => {

    const {id} = useParams()

    useEffect(()=>{
        getTripById(id)
    },[getTripById])
    return (
        <Fragment>
            {trip === null ? (
            <p>You have not any trip</p>
            ): (
                <div className="trip_container">
                    <div className="row">
                        <div className="col-9 p-5">
                            <TripMap/>
                        </div>
                        <div className="col-3 p-5">

                        </div>
                    </div>
                    <h1>{trip.title}</h1>
                    <div className="trip_information">
                        <p>Starting point: {trip.starting_point}</p>
                        <p>Final destination: {trip.final_destination}</p>
                        <p>From: {trip.from}</p>
                        <p>To: {trip.to}</p>
                        <p>Description: {trip.description}</p>
                    </div>
                </div>
            )}
        </Fragment>
        )
}

ShowTrip.propTypes = {
    getTripById: PropTypes.func.isRequired,
    trips: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    trips: state.trips
})

export default connect(mapStateToProps,{getTripById})(ShowTrip);