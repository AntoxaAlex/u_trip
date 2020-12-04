import React ,{useState} from "react";
import config from "../../config.json"
import {
    GoogleMap,
    useLoadScript,
    Marker,
    InfoWindow
} from "@react-google-maps/api";


const libraries = ["places"]

const mapContainerStyle = {
    width: "100%",
    height: "500px"
}

const center ={
    lat: 46.291186,
    lng: 30.655622
}

const options ={
    disableDefaultUI: true,
    zoomControl: true,
    styles: "satellite"
}



const Map = ({el1, el2, setMapPosition}) =>{
    const[position, setPosition] = useState([])

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
                onClick={(e)=>{
                    setPosition(current => [...current, {
                        lat: e.latLng.lat(),
                        lng: e.latLng.lng(),
                        time: new Date()
                       },
                    ]
                   )
                    if(position.length > 0){
                        const lat = position[position.length-1].lat
                        const lng = position[position.length-1].lng
                        const time = position[position.length-1].time
                        setMapPosition(lat, lng, el1, el2)
                    }

                }}
            >
                {position.length > 0 ?(
                    <Marker position={{
                        lat: position[position.length-1].lat,
                        lng: position[position.length-1].lng
                    }}/>
                ):("")}
            </GoogleMap>
    )
}



export default Map