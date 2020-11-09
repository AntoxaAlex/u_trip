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

const TripMap = ({trip, center}) =>{

    const[selected, setSelected] = useState({
        isDisplayed: false,
        title: "",
        lat: "",
        lng: ""
    })

    const setInfoWindow =(title, lat, lng) => {
        setSelected({...selected, isDisplayed: true, title: title, lat: lat, lng: lng})
    }

    const mapContainerStyle = {
        width: "100%",
        height: "500px"
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

            <Marker key={trip.sp_title}
                    position={{
                        lat: parseFloat(trip.sp_latitude),
                        lng: parseFloat(trip.sp_longitude)
                    }}
                    onMouseOver={()=>setInfoWindow(trip.sp_title,trip.sp_latitude, trip.sp_longitude)}
            />

            {trip.campContent.map((camp, i)=>{
                return(
                    <Marker key={i}
                            position={{lat: parseFloat(camp.campLatitude), lng: parseFloat(camp.campLongitude)}}
                            onMouseOver={()=>setInfoWindow(camp.campTitle, camp.campLatitude, camp.campLongitude)}
                    />
                )
            })}

            <Marker key={trip.fd_title}
                    position={{lat: parseFloat(trip.fd_latitude), lng: parseFloat(trip.fd_longitude)}}
                    onMouseOver={()=>setInfoWindow(trip.fd_title,trip.fd_latitude, trip.fd_longitude)}
            />


            {selected.isDisplayed ? (
                <InfoWindow
                    position={{lat: parseFloat(selected.lat), lng: parseFloat(selected.lng)}}
                    onCloseClick={()=>setSelected({...selected,isDisplayed: false})}
                >
                    <div>
                        <h2>{selected.title}</h2>
                        <p>Latitude: {selected.lat}</p>
                        <p>Longitude:  {selected.lng}</p>
                    </div>
                </InfoWindow>
            ): null}

        </GoogleMap>
    )
}

const mapStateToProps = state =>({
    trip: state.trips.trip
})


export default connect(mapStateToProps)(TripMap)