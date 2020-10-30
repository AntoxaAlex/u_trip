import React ,{useState} from "react";
import config from "../../config.json"
import {connect} from "react-redux";
import {
    GoogleMap,
    useLoadScript,
    Marker,
    InfoWindow
} from "@react-google-maps/api";

const libraries = ["places"]

const TripMap = ({trip}) =>{

console.log(trip)


    const mapContainerStyle = {
        width: "600px",
        height: "600px"
    }

    const center ={
        lat: parseFloat(trip.sp_latitude),
        lng: parseFloat(trip.sp_longitude)
    }

    const options ={
        disableDefaultUI: true,
        zoomControl: true,
        styles: "satellite"
    }

    const {isLoaded, loadError} = useLoadScript({
        googleMapsApiKey: config.GOOGLE_MAP_API_KEY,
        libraries
    });

    if(loadError) return "Error loading map"
    if(!isLoaded) return "Loading map"

    return(
        <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={8}
            center={center}
            options={options}
            onClick={(e)=>{}}
        >

            <Marker key={trip.sp_title} position={{lat: parseFloat(trip.sp_latitude), lng: parseFloat(trip.sp_longitude)}}/>

            {trip.campContent.map((camp, i)=>{
                console.log(camp)
                return(
                    <Marker key={i} position={{lat: parseFloat(camp.campLatitude), lng: parseFloat(camp.campLongitude)}}/>
                )
            })}

            <Marker key={trip.fd_title} position={{lat: parseFloat(trip.fd_latitude), lng: parseFloat(trip.fd_longitude)}}/>

        </GoogleMap>
    )
}

const mapStateToProps = state =>({
    trip: state.trips.trip
})


export default connect(mapStateToProps)(TripMap)