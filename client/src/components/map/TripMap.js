import React, {useState, Fragment, useEffect} from "react";
import config from "../../config.json"
import Spinner from "../layout/Spinner";
import {
    GoogleMap,
    Marker,
    useJsApiLoader,
    Polyline
} from "@react-google-maps/api";

const mapContainerStyle = {
    width: "100%",
    height: "500px"
}



const options ={
    disableDefaultUI: true,
    zoomControl: true,
}


const libraries = ["places"]

const TripMap = ({center, mapType, trip, setMapPosition}) =>{

    const[currentPosition, setCurrentPosition] = useState({
        lat: "",
        lng: ""
    })

    useEffect(()=>{
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) =>{
                setCurrentPosition({...currentPosition,lat: parseFloat(position.coords.latitude), lng: parseFloat(position.coords.longitude)})
            });
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    },[])


    const{isLoaded,loadError} = useJsApiLoader({
        googleMapsApiKey: config.GOOGLE_MAP_API_KEY,
        libraries
    })

    const[position, setPosition] = useState([])



    const renderMap = () => {
        const onLoad = ()=>{
            console.log("Map is loaded")
        }

        if(mapType !== "create"){
            return <GoogleMap
                onLoad={onLoad}
                mapContainerStyle={mapContainerStyle}
                zoom={15}
                center={center}
                options={options}
            >

                <Marker key={trip.st_point.sp_title}
                        position={{
                            lat: parseFloat(trip.st_point.sp_latitude),
                            lng: parseFloat(trip.st_point.sp_longitude)
                        }}
                        icon={{
                            url: "https://res.cloudinary.com/antoxaalex/image/upload/v1607210948/maps/icons8-flag-2-48_xbbbrl.png",
                            scaledSize: new window.google.maps.Size(30,30)
                        }}
                />
                {trip.campContent.map((camp, i)=>{
                    return(
                        <Fragment  key={i}>
                            <Marker
                                    position={{lat: parseFloat(camp.campLatitude), lng: parseFloat(camp.campLongitude)}}
                                    icon={{
                                        url: "https://res.cloudinary.com/antoxaalex/image/upload/v1607209963/maps/icons8-map-pin-96_nanxdr.png",
                                        scaledSize: new window.google.maps.Size(30,30)
                                    }}
                            />

                            <Polyline
                                options={{
                                    path: [
                                        {
                                            lat: i === 0 ? parseFloat(trip.st_point.sp_latitude) : (i > 1 ?  parseFloat(trip.campContent[i-1].campLatitude) : parseFloat(trip.campContent[0].campLatitude)),
                                            lng: i === 0 ? parseFloat(trip.st_point.sp_longitude) : (i > 1  ?  parseFloat(trip.campContent[i-1].campLongitude) : parseFloat(trip.campContent[0].campLongitude))
                                        },
                                        {
                                            lat: parseFloat(camp.campLatitude),
                                            lng: parseFloat(camp.campLongitude)
                                        }
                                    ],
                                    strokeColor: camp.isCampReached ? "green" : "#EA4335",
                                    strokeOpacity: 0,
                                    icons: [
                                        {
                                            icon: {
                                                path: "M 0 -1 0,1",
                                                strokeOpacity: 1,
                                                scale: 2,
                                            },
                                            offset: "0",
                                            repeat: "10px",
                                        }
                                    ]
                                }}
                            />
                        </Fragment>
                    )
                })}

                <Polyline
                    options={{
                        path: [
                            {
                                lat: trip.campContent.length > 1 ? parseFloat(trip.campContent[trip.campContent.length-1].campLatitude) : (trip.campContent.length === 1 ?  parseFloat(trip.campContent[0].campLatitude) : parseFloat(trip.sp_latitude)),
                                lng: trip.campContent.length > 1 ? parseFloat(trip.campContent[trip.campContent.length-1].campLongitude) : (trip.campContent.length === 1 ?  parseFloat(trip.campContent[0].campLongitude) : parseFloat(trip.sp_longitude))
                            },
                            {lat: parseFloat(trip.fn_destination.fd_latitude), lng: parseFloat(trip.fn_destination.fd_longitude)}
                        ],
                        strokeColor: trip.fn_destination.isFdReached ? "green" : "#EA4335",
                        strokeOpacity: 0,
                        icons: [
                            {
                                icon: {
                                    path: "M 0 -1 0,1",
                                    strokeOpacity: 1,
                                    scale: 2,
                                },
                                offset: "0",
                                repeat: "10px",
                            }
                        ]
                    }}
                />

                <Marker key={trip.fn_destination.fd_title}
                        position={{lat: parseFloat(trip.fn_destination.fd_latitude), lng: parseFloat(trip.fn_destination.fd_longitude)}}
                        icon={{
                            url: "https://res.cloudinary.com/antoxaalex/image/upload/v1607210946/maps/icons8-flag-filled-48_1_ewi69n.png",
                            scaledSize: new window.google.maps.Size(30,30)
                        }}
                />

                {currentPosition.lat !== "" && currentPosition.lng !== "" &&
                <Marker key="currentPosIcon"
                        position={{lat: parseFloat(currentPosition.lat), lng: parseFloat(currentPosition.lng)}}
                        icon={{
                            url: "https://res.cloudinary.com/antoxaalex/image/upload/v1608038656/maps/icons8-street-view-48_s6syo4.png",
                            scaledSize: new window.google.maps.Size(30,30)
                        }}
                />
                }


            </GoogleMap>
        } else {
            return <GoogleMap
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
                        setMapPosition(e.latLng.lat(), e.latLng.lng())

                    }}
                >
                    {trip.sp_latitude !== "" && trip.sp_longitude !== ""  ?(
                        <Marker
                            position={{
                            lat: parseFloat(trip.sp_latitude),
                            lng: parseFloat(trip.sp_longitude)
                            }}
                            icon={{
                                url: "https://res.cloudinary.com/antoxaalex/image/upload/v1607210948/maps/icons8-flag-2-48_xbbbrl.png",
                                scaledSize: new window.google.maps.Size(30,30)
                            }}
                        />
                    ):null}

                {trip.campContent.length > 0 && <Fragment>
                    {trip.campContent.filter(content=>content.campLatitude !== "" && content.campLongitude !== "").map((camp, i)=>{
                        return(
                            <Fragment key={i}>
                                <Marker
                                    position={{
                                    lat: parseFloat(camp.campLatitude),
                                    lng: parseFloat(camp.campLongitude)
                                }}
                                    icon={{
                                        url: "https://res.cloudinary.com/antoxaalex/image/upload/v1607209963/maps/icons8-map-pin-96_nanxdr.png",
                                        scaledSize: new window.google.maps.Size(30,30)
                                    }}
                                />
                                <Polyline
                                    options={{
                                        path: [
                                            {
                                                lat: i === 0 ? parseFloat(trip.sp_latitude) : (i > 1 ?  parseFloat(trip.campContent[i-1].campLatitude) : parseFloat(trip.campContent[0].campLatitude)),
                                                lng: i === 0 ? parseFloat(trip.sp_longitude) : (i > 1  ?  parseFloat(trip.campContent[i-1].campLongitude) : parseFloat(trip.campContent[0].campLongitude))
                                            },
                                            {
                                                lat: parseFloat(camp.campLatitude),
                                                lng: parseFloat(camp.campLongitude)
                                            }
                                        ],
                                        strokeColor: "#EA4335",
                                        strokeOpacity: 0,
                                        icons: [
                                            {
                                                icon: {
                                                    path: "M 0 -1 0,1",
                                                    strokeOpacity: 1,
                                                    scale: 2,
                                                },
                                                offset: "0",
                                                repeat: "10px",
                                            }
                                        ]
                                    }}
                                />
                            </Fragment>
                        )
                    })}
                </Fragment>}

                {trip.fd_latitude !== "" && trip.fd_longitude !== ""  ?(<Fragment>
                        <Marker
                            position={{
                            lat: parseFloat(trip.fd_latitude),
                            lng: parseFloat(trip.fd_longitude)
                        }}
                            icon={{
                                url: "https://res.cloudinary.com/antoxaalex/image/upload/v1607210946/maps/icons8-flag-filled-48_1_ewi69n.png",
                                scaledSize: new window.google.maps.Size(30,30)
                            }}
                        />
                        <Polyline
                            options={{
                                path: [
                                    {
                                        lat: trip.campContent.length > 1 ? parseFloat(trip.campContent[trip.campContent.length-1].campLatitude) : (trip.campContent.length === 1 ?  parseFloat(trip.campContent[0].campLatitude) : parseFloat(trip.sp_latitude)),
                                        lng: trip.campContent.length > 1 ? parseFloat(trip.campContent[trip.campContent.length-1].campLongitude) : (trip.campContent.length === 1 ?  parseFloat(trip.campContent[0].campLongitude) : parseFloat(trip.sp_longitude))
                                    },
                                    {lat: parseFloat(trip.fd_latitude), lng: parseFloat(trip.fd_longitude)}
                                ],
                                strokeColor: "#EA4335",
                                strokeOpacity: 0,
                                icons: [
                                    {
                                        icon: {
                                            path: "M 0 -1 0,1",
                                            strokeOpacity: 1,
                                            scale: 2,
                                        },
                                        offset: "0",
                                        repeat: "10px",
                                    }
                                ]
                            }}
                        />
                    </Fragment>):null}
                </GoogleMap>

        }
    }

    if(loadError){
        return <div>Map cannot be loaded right now, sorry.</div>
    }

    return isLoaded ? renderMap() : <Spinner/>
}

export default TripMap