import React,{Fragment, useEffect, useState} from "react";
import {Redirect, useParams} from "react-router";
import {connect} from "react-redux";
import {getTripById, createTrip} from "../../actions/trips";
import {getAllProfilesExceptOwn} from "../../actions/profile";
import PropTypes from "prop-types";
import Map from "../map/Map";
import axios from "axios";
import Spinner from "../layout/Spinner";
import ReactCrop from "react-image-crop";
import 'react-image-crop/dist/ReactCrop.css';

const EditTrip = ({getTripById, getAllProfilesExceptOwn, createTrip, trips:{trip, loading}, profile})=>{
    const {id} = useParams()

    //===================================================State===================================================
    const[formData, setFormData]= useState({
        title: "",
        from: "",
        to: "",
        isCompleted: "",
        trip_description: ""
    });

    const[userProfiles, setProfiles] = useState([])
    const[teammates, setTeammates] = useState([])
    const [assembledTeammates, setAssembledTeammates] = useState([])

    const[displayList, setProfileList] =useState(false)

    const[imageForm, setImage] =useState({
        tripImgSrc: "",
        tripImage: "",
        sp_image: "",
        fd_image: ""
    });

    const [crop, setCrop] = useState({
        tripImageCrop: {
            unit: "%",
            width: 30,
            aspect: 32 / 9
        }
    });

    const[stPointForm, setStartingPoint] =useState({
        sp_title: "",
        sp_description: ""
    });

    const[fnDestinationForm, setFinalDestination] =useState({
        fd_title: "",
        fd_description: ""

    });

    const[campContent, setCamp] =useState([]);

    const [displayedPoint, setDisplayedPoint] = useState({
        val: "st_point"
    })

    const[displayMap, setMap] = useState({
        st_point_map: false,
        fn_destination_map: false
    })

    const[displayCampMap, setCampMap] =useState([]);

    const[position, setPosition] = useState({
        sp_latitude: "",
        sp_longitude: "",
        fd_latitude: "",
        fd_longitude: ""
    })

    useEffect(()=>{
        getTripById(id)
        getAllProfilesExceptOwn()
        setProfiles(profile.profiles)
        if(trip){
            setFormData({
                title: loading || !trip.title ? "" : trip.title,
                from: loading || !trip.from ? "" : trip.from,
                to: loading || !trip.to ? "" : trip.to,
                isCompleted: loading || !trip.isCompleted ? false : trip.isCompleted,
                trip_description: loading || !trip.trip_description ? "" : trip.trip_description
            })
            setAssembledTeammates(loading || !trip.team ? null : trip.team)
            setImage({
                tripImage: loading || !trip.tripImage ? "" : trip.tripImage,
                sp_image: loading || !trip.sp_image ? "" : trip.sp_image,
                fd_image: loading || !trip.fd_image ? "" : trip.fd_image
            })
            setStartingPoint({
                sp_title: loading || !trip.sp_title ? "" : trip.sp_title,
                sp_description: loading || !trip.sp_description ? "" : trip.sp_description
            })
            setFinalDestination({
                fd_title: loading || !trip.fd_title ? "" : trip.fd_title,
                fd_description: loading || !trip.fd_description ? "" : trip.fd_description
            })
            setPosition({
                sp_latitude: loading || !trip.sp_latitude ? "" : trip.sp_latitude,
                sp_longitude: loading || !trip.sp_longitude ? "" : trip.sp_longitude,
                fd_latitude: loading || !trip.fd_latitude ? "" : trip.fd_latitude,
                fd_longitude: loading || !trip.fd_longitude ? "" : trip.fd_longitude,
            })

            setCamp(loading || !trip.campContent.length === 0 ? [] : trip.campContent)
        }
    },[loading, profile.loading])


    const [isSubmited, setSubmit]=useState(false)

    if(isSubmited){
        return <Redirect to="/n/dashboard"/>
    }

    //===================================================Add/Remove camp functions===================================================



    const addCamp = () =>{

        setCamp([...campContent, {
            campTitle: "",
            campImage: "",
            campDescription: "",
            campLatitude: "",
            campLongitude: ""
        }])
    }


    const removeCamp = index =>{
        const campList = [...campContent];
        campList.splice(index,1);
        setCamp(campList)
    }

    //===================================================Retrieve variables from state===================================================
    const {
        title,
        from,
        isCompleted,
        to,
        trip_description
    } = formData;

    const {
        tripImage,
        sp_image,
        fd_image
    } = imageForm

    const{
        sp_title,
        sp_description,
    } = stPointForm

    const {
        fd_title,
        fd_description,
    } = fnDestinationForm

    const{
        sp_latitude,
        sp_longitude,
        fd_latitude,
        fd_longitude
    } = position


    ////===================================================Upload camp images to cloudinary===================================================
    const uploadImage = async (name, file) =>{
        const imgForm = new FormData()
        imgForm.append(name, file)
        console.log(name, file)
        try{
            const imgUrl = await axios.post("/trips/"+name, imgForm)
            console.log(imgUrl.data)
            setImage({...imageForm, [name]:imgUrl.data})

        }catch (e) {
            console.log(e)
        }
    }

    const uploadCampImages = async (file,index, name) =>{
        console.log(file,index, name)
        const campImageForm = new FormData()
        campImageForm.append("campImage", file)
        console.log(campImageForm)
        try {
            const campImageUrl =await axios.post("/trips/campImage", campImageForm)
            const campList = [...campContent];
            campList[index][name] = campImageUrl.data
            setCamp(campList);
        }catch (e) {
            console.log(e)
        }
    }

    //===================================================Get position===================================================
    const getPosition = (el1, el2) =>{
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) =>{
                document.getElementById(el1).textContent = position.coords.latitude
                document.getElementById(el2).textContent = position.coords.longitude
            });
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }

    //===================================================Search teammates===================================================


    const searchTeammates = (e) => {
        const {value} = e.target;
        const selectedProfiles = [...userProfiles].filter(profile=>profile.user.firstname.toLowerCase().includes(value))
        setTeammates(selectedProfiles)
    }

    const addTeammate = (teammate) =>{
        setAssembledTeammates([...assembledTeammates,teammate])
    }

    const removeMember = (teammate, index) =>{
        const teammates = [...assembledTeammates]
        teammates.splice(index,1)
        setAssembledTeammates(teammates)
    }


    //===================================================Map===================================================

    const togglePanel = (map) =>{
        if(map === "st_point_map"){
            setMap({...displayMap, [map]: !displayMap.st_point_map})
        } else if(map === "fn_destination_map"){
            setMap({...displayMap, [map]: !displayMap.fn_destination_map})
        }

    }

    const toggleCampPanel = (map, i) => {

        const displayMap = [...displayCampMap];
        displayMap[i] = true;
        setCampMap(displayMap);
    }

    const setMapPosition = (lat, lng, el1, el2) =>{
        document.getElementById(el1).textContent = lat
        document.getElementById(el2).textContent = lng
    }


    //===================================================Change inputs values===================================================
    const onChange = e => {
        setFormData({...formData, [e.target.name]: e.target.value})

    };
    const onChangeImage = (e) => {
        const {name, files} = e.target;
        uploadImage(name, files[0])
    }

    const onChangeTripImage = async (e, id) =>{
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () =>{
                    if(id === "tripMain"){
                        setImage({...imageForm, tripImgSrc: reader.result })
                        console.log(imageForm.tripImgSrc)
                    } else if(id === "st_point"){
                        setImage({...imageForm, spImgSrc: reader.result })
                        console.log(imageForm.spImgSrc)
                    } else if(id === "fn_destination"){
                        setImage({...imageForm, fdImgSrc: reader.result })
                        console.log(imageForm.fdImgSrc)
                    } else{
                        const campList = [...campContent];
                        campList[id].campImageSrc = reader.result
                        setCamp(campList);
                        console.log(campList[id].campImageSrc)
                    }
                }
            );
            reader.readAsDataURL(e.target.files[0]);
        }

    }

    const onTripImageLoaded = image => {
        setImage({...imageForm, imageRef: image})
    };
    const onTripCropComplete = (crop, id) => {
        makeClientCrop(crop,id);
    };

    const makeClientCrop = async (crop,id) => {
        if (imageForm.imageRef && crop.width && crop.height) {
            getCroppedImg(
                imageForm.imageRef,
                crop,
                id
            );

        }
    }


    const getCroppedImg = (image, crop, id) =>{
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );

        const reader = new FileReader()
        canvas.toBlob(blob => {
            reader.readAsDataURL(blob)
            reader.onloadend = () => {
                dataURLtoFile(reader.result, 'avatar.jpg', id)
            }
        })
    }

    const dataURLtoFile = (dataUrl, fileName, id) =>{
        let arr = dataUrl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);

        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        const croppedImage = new File([u8arr], fileName, {type:mime});

        uploadImage(id, croppedImage)
    }

    const onChangeStPoint = e => setStartingPoint({...stPointForm, [e.target.name]: e.target.value});
    const onChangeFnDestination = e => setFinalDestination({...fnDestinationForm, [e.target.name]: e.target.value});
    const onChangeCamp = (e,index) => {
        const {name, value} = e.target;
        const campList = [...campContent];
        campList[index][name] = value;
        setCamp(campList);
    }
    const onChangeCampImage = (e, index) =>{
        const {name, files} = e.target;
        uploadCampImages(files[0], index, name)
    }



    //===================================================Submit===================================================
    const onSubmit = e => {
        e.preventDefault();
        const imageForm = new FormData()
        imageForm.append('tripImage', tripImage[0])

        // console.log(imageForm)
        // console.log(title,
        //     from,
        //     isCompleted,
        //     to,
        //     trip_description)
        // console.log("StPoint:  " + sp_title,
        //     sp_description,
        //     sp_image,
        //     sp_latitude,
        //     sp_longitude,
        // )
        // console.log("fnDest:   "+ fd_title,
        //     fd_description,
        //     fd_image,
        //     fd_latitude,
        //     fd_longitude)
        //
        // console.log(campContent)
        //

        console.log(sp_image)
        createTrip(
            id,
            "edit",
            tripImage,
            title,
            trip_description,
            from,
            to,
            isCompleted,
            assembledTeammates,
            sp_title,
            sp_description,
            sp_image,
            sp_latitude,
            sp_longitude,
            campContent,
            fd_title,
            fd_description,
            fd_image,
            fd_latitude,
            fd_longitude
        )
        setSubmit(true)
    }

    //===================================================JSX===================================================
    return (
        <div id="newTripDiv">
            {trip === null && loading ? (<Spinner/>): (<Fragment>
                {trip !== null ? (<Fragment>
                    <form onSubmit={e=>onSubmit(e)} encType="multipart/form-data">
                        <div className="tripMainImageDiv mb-5">
                            <div className="tripHeader row">
                                <div className="col-1 text-center">
                                    <h1 className="headerNum">1</h1>
                                </div>
                                <h1 className="text-left col-11">Upload new image of your trip</h1>
                            </div>
                            <div className="form-group">
                                <label htmlFor="tripImage" className="label">
                                    <p className="title"><i className="far fa-file-image"/>  Upload image</p>
                                    <input
                                        type="file"
                                        name="tripImage"
                                        id="tripImage"
                                        accept="image/*"
                                        onChange={(e)=> onChangeTripImage(e, "tripMain")}
                                    />
                                </label>
                            </div>
                            <div className="croper">
                                {imageForm.tripImgSrc?(<Fragment>
                                    <ReactCrop
                                        className="float-left mb-5"
                                        src={imageForm.tripImgSrc}
                                        crop={crop.tripImageCrop}
                                        ruleOfThirds
                                        onImageLoaded={(image)=>onTripImageLoaded(image)}
                                        onChange={newCrop => setCrop({...crop, tripImageCrop: newCrop})}
                                        onComplete={(crop)=>onTripCropComplete(crop, "tripMain")}
                                    />
                                </Fragment>):null }
                            </div>
                        </div>

                        <div className="mainTripInfo mb-5">
                            <div className="tripHeader row">
                                <div className="col-1 text-center">
                                    <h1 className="headerNum">2</h1>
                                </div>
                                <h1 className="text-left col-11">Update main information</h1>
                            </div>
                            <div className="form-group row" style={{width: "60%"}}>
                                <label htmlFor="title" className="col-sm-3 col-form-label">Trip's title</label>
                                <input
                                    type="text"
                                    className="form-control col-sm-9"
                                    name="title"
                                    id="title"
                                    autoComplete="off"
                                    value={title}
                                    onChange={(e)=>onChange(e)}
                                />
                            </div>
                            <div className="form-group row" style={{width: "60%"}}>
                                <label htmlFor="title" className="col-sm-3 col-form-label">Description</label>
                                <textarea
                                    className="form-control col-sm-9"
                                    name="trip_description"
                                    id="description"
                                    value={trip_description}
                                    onChange={(e)=>onChange(e)}
                                />
                            </div>
                            <div className="form-group row" style={{width: "60%"}}>
                                <label htmlFor="title" className="col-sm-3 col-form-label">Start date</label>
                                <input
                                    type="date"
                                    className="form-control col-sm-9"
                                    name="from"
                                    id="from"
                                    value={from}
                                    onChange={(e)=>onChange(e)}
                                />
                            </div>
                            {isCompleted === "yes"  ?(
                                <div className="form-group row" style={{width: "60%"}}>
                                    <label htmlFor="to" className="col-sm-3 col-form-label">End date</label>
                                    <input
                                        type="date"
                                        className="form-control col-sm-9"
                                        name="to"
                                        id="to"
                                        value={to}
                                        onChange={(e)=>onChange(e)}
                                    />
                                </div>
                            ):(
                                <Fragment>
                                    <p>Trip is still in progress</p>
                                </Fragment>
                            )}
                            <p>Is trip completed completed?</p>
                            <div>
                                <label htmlFor="isCompleted1">Yes</label>
                                <input
                                    type="radio"
                                    name="isCompleted"
                                    id="isCompleted1"
                                    value="yes"
                                    onChange={(e)=>onChange(e)}
                                />

                                <label htmlFor="isCompleted2">No</label>
                                <input
                                    type="radio"
                                    name="isCompleted"
                                    id="isCompleted2"
                                    value="no"
                                    onChange={(e)=>onChange(e)}
                                />

                            </div>
                        </div>
                        <div className="tripTeamDiv mb-5">
                            <div className="tripHeader row">
                                <div className="col-1 text-center">
                                    <h1 className="headerNum">3</h1>
                                </div>
                                <h1 className="text-left col-11">Assemble a team</h1>
                            </div>
                            <div className="searchTeammateDiv mb-4">
                                <input
                                    type="text"
                                    placeholder="Write name"
                                    className="form-control searchTeamInput"
                                    onChange={(e)=>searchTeammates(e)}
                                />
                                {teammates.length > 0 && !displayList && <ul className="searchedTeammateList">
                                    {teammates.map((teammate, i)=>{
                                        return(
                                            <li key={i} className="my-3">
                                                <div className="row">
                                                    <div className="col-1">
                                                        <img alt="" className="rounded-circle" style={{width: "50px", height: "50px"}} src={teammate.imageUrl}/>
                                                    </div>
                                                    <div className="col-3 ">
                                                        <p>{teammate.user.firstname} {teammate.user.secondname}</p>
                                                    </div>
                                                    <div className="col-2">
                                                        <p>{teammate.status ? teammate.status : "No status"}</p>
                                                    </div>
                                                    <div className="col-2">
                                                        {teammate.preferences.length > 0 && <div className="row">
                                                            {teammate.preferences.map((preference, i) => {
                                                                return(
                                                                    <div key={i} className="col-1"><i className={preference.iconClass}/></div>
                                                                )
                                                            })}
                                                        </div>}
                                                    </div>
                                                    <div className="col-2">

                                                    </div>
                                                    <div className="col-2">
                                                        {teammate.status === "ready for trip" ? (
                                                            <button type="button" className="btn btn-outline-success" onClick={()=>addTeammate(teammate)}>Add teammate</button>
                                                        ) : (
                                                            <button type="button" className="btn btn-outline-secondary">Add teammate</button>
                                                        )}
                                                    </div>
                                                </div>
                                                <hr/>
                                            </li>
                                        )
                                    })}
                                </ul>
                                }
                            </div>
                            <div className="teammatesHeaderDiv text-center">
                                <h3 className="m-0">Trip's members</h3>
                            </div>
                            <div className="assemblesTeammatesDiv mb-3">
                                <div className="row p-3">
                                    {assembledTeammates && assembledTeammates.length > 0 && <Fragment>
                                        {assembledTeammates.map((teammate, i)=>{
                                            return(
                                                <div key={i} className="assembledMember col-2 mb-3 text-center">
                                                    <img
                                                        className="rounded-circle mb-2"
                                                        alt="" src={teammate.avatar}
                                                        style={{width: "100px", height: "100px"}}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-danger d-block mx-auto"
                                                        onClick={()=>removeMember(teammate, i)}
                                                    >Remove</button>
                                                </div>
                                            )
                                        })}
                                    </Fragment>}
                                </div>
                            </div>
                        </div>

                        <div className="tripRouteDiv">
                            <div className="tripHeader row">
                                <div className="col-1 text-center">
                                    <h1 className="headerNum">4</h1>
                                </div>
                                <h1 className="text-left col-11">Create route</h1>
                            </div>
                            <div className="routePlan p-3">
                                <button
                                    type="button"
                                    className="btn btn-lg btn-outline-secondary addCampBtn"
                                    onClick={()=>addCamp()}
                                >Add point</button>
                                <div className="routeTrack my-3">
                                    <input
                                        type="radio"
                                        value="st_point"
                                        name="displayedPoint"
                                        onClick={(e)=>setDisplayedPoint({val: e.target.value})}
                                    />
                                    <div className="pointRadiosDiv">
                                        {
                                            campContent.map((camp,i)=>{
                                                return(
                                                    <Fragment key={i}>
                                                       <span className="waySpanRadio">---
                                                           <input
                                                               type="radio"
                                                               value={"camp" + i}
                                                               name="displayedPoint"
                                                               onClick={(e)=>setDisplayedPoint({val: e.target.value})}
                                                           />
                                                       </span>
                                                    </Fragment>
                                                )
                                            })
                                        }
                                    </div>
                                    <span className="waySpanRadio">---
                                        <input
                                            type="radio"
                                            name="displayedPoint"
                                            value="fn_destination"
                                            onClick={(e)=>setDisplayedPoint({val: e.target.value})}
                                        />
                                    </span>
                                </div>
                                {displayedPoint &&
                                <div className="card mb-3" >
                                    {displayedPoint.val === "st_point"  ?(
                                        <Fragment>
                                            <h3 className="ml-2">Starting Point</h3>
                                            <div className="row no-gutters">
                                                <div className="col-md-3">
                                                    <div id="tripImage" className="upload-image">
                                                        <div className="form-group">
                                                            <label htmlFor="sp_image" className="label" style={{backgroundPosition: "center", backgroundSize: "cover", backgroundImage: `url(${sp_image})`}}>
                                                                <i className="far fa-file-image"/>
                                                                <span className="title">Add image</span>
                                                                <input
                                                                    type="file"
                                                                    name="sp_image"
                                                                    id="sp_image"
                                                                    accept="image/*"
                                                                    onChange={(e)=> onChangeImage(e)}
                                                                />
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="card-body p-0">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name="sp_title"
                                                            id="sp_title"
                                                            autoComplete="off"
                                                            placeholder="Title"
                                                            value={sp_title}
                                                            onChange={(e)=>onChangeStPoint(e)}
                                                        />
                                                        <textarea
                                                            className="form-control"
                                                            name="sp_description"
                                                            id="sp_description"
                                                            autoComplete="off"
                                                            placeholder="Description"
                                                            value={sp_description}
                                                            onChange={(e)=>onChangeStPoint(e)}
                                                        />
                                                    </div>
                                                    <div className="row card-body">
                                                        <div className="col-6 p-0">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="sp_latitude"
                                                                placeholder="Write latitude"
                                                                autoComplete="off"
                                                                id="sp_latitude"
                                                                value={sp_latitude}
                                                                onChange={(e)=>onChangeStPoint(e)}
                                                            />
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="sp_longitude"
                                                                placeholder="Write longitude"
                                                                autoComplete="off"
                                                                id="sp_longitude"
                                                                value={sp_longitude}
                                                                onChange={(e)=>onChangeStPoint(e)}
                                                            />
                                                        </div>
                                                        <div className="col-6">
                                                            <p id="sp_latitude_span"/>
                                                            <p id="sp_longitude_span"/>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-secondary"
                                                        onClick={()=>getPosition("sp_latitude_span","sp_longitude_span")}
                                                    >Get current position</button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-secondary"
                                                        onClick={()=>togglePanel("st_point_map")}
                                                    >Choose on map</button>
                                                </div>
                                                <div className="col-md-5">

                                                </div>
                                            </div>
                                            {displayMap.st_point_map && <div className="googleMapDiv st_point_MapPanel">
                                                <Map el1={"sp_latitude_span"} el2={"sp_longitude_span"} setMapPosition={setMapPosition}/>
                                            </div>}
                                        </Fragment>
                                    ):null}
                                    {displayedPoint.val === "fn_destination" && <Fragment>
                                        <h3 className="ml-2">Final Destination</h3>
                                        <div className="row no-gutters">
                                            <div className="col-md-3">
                                                <div id="tripImage" className="upload-image">
                                                    <div className="form-group">
                                                        <label htmlFor="fd_image" className="label" style={{backgroundPosition: "center", backgroundSize: "cover", backgroundImage: `url(${fd_image})`}}>
                                                            <i className="far fa-file-image"/>
                                                            <span className="title">Add image</span>
                                                            <input
                                                                type="file"
                                                                name="fd_image"
                                                                id="fd_image"
                                                                accept="image/*"
                                                                onChange={(e)=> onChangeImage(e)}
                                                            />
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="card-body p-0">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="fd_title"
                                                        id="fd_title"
                                                        autoComplete="off"
                                                        placeholder="Title"
                                                        value={fd_title}
                                                        onChange={(e)=>onChangeFnDestination(e)}
                                                    />
                                                    <textarea
                                                        className="form-control"
                                                        name="fd_description"
                                                        id="fd_description"
                                                        autoComplete="off"
                                                        placeholder="Description"
                                                        value={fd_description}
                                                        onChange={(e)=>onChangeFnDestination(e)}
                                                    />
                                                </div>
                                                <div className="row card-body">
                                                    <div className="col-6 p-0">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name="fd_latitude"
                                                            placeholder="Write latitude"
                                                            autoComplete="off"
                                                            id="fd_latitude"
                                                            value={fd_latitude}
                                                            onChange={(e)=>onChangeFnDestination(e)}
                                                        />
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name="fd_longitude"
                                                            placeholder="Write longitude"
                                                            autoComplete="off"
                                                            id="fd_longitude"
                                                            value={fd_longitude}
                                                            onChange={(e)=>onChangeFnDestination(e)}
                                                        />
                                                    </div>
                                                    <div className="col-6">
                                                        <p id="fd_latitude_span"/>
                                                        <p id="fd_longitude_span"/>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-secondary"
                                                    onClick={()=>getPosition("fd_latitude_span","fd_longitude_span")}
                                                >Get current position</button>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-secondary"
                                                    onClick={()=>togglePanel("fn_destination_map")}
                                                >Choose on map</button>
                                            </div>
                                            <div className="col-md-5">

                                            </div>
                                        </div>
                                        {displayMap.fn_destination_map && <div className="googleMapDiv fn_destination_MapPanel">
                                            <Map el1={"fd_latitude_span"} el2={"fd_longitude_span"} setMapPosition={setMapPosition}/>
                                        </div>}
                                    </Fragment>}
                                    {campContent.map((el,i)=>{
                                        return(
                                            <Fragment key={i}>
                                                {displayedPoint.val === "camp"+i && <Fragment>
                                                    <h3 className="ml-2">Camp {i+1}</h3>
                                                    <div className="row no-gutters">
                                                        <div className="col-md-3 text-center">
                                                            <div id="tripImage" className="upload-image">
                                                                <div className="form-group">
                                                                    <label htmlFor={"campImage"+i} className="label" style={{backgroundPosition: "center", backgroundSize: "cover", backgroundImage: `url(${el.campImage})`}}>
                                                                        <i className="far fa-file-image"/>
                                                                        <span className="title">Add image</span>
                                                                        <input
                                                                            type="file"
                                                                            name="campImage"
                                                                            id={"campImage"+i}
                                                                            accept="image/*"
                                                                            onChange={(e)=>  onChangeCampImage(e,i)}
                                                                        />
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <button type="button"
                                                                className="btn btn-sm btn-outline-danger" onClick={()=>removeCamp(i)}>
                                                                Delete camp
                                                            </button>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <div className="card-body p-0">
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="campTitle"
                                                                    id={"campTitle" + i}
                                                                    autoComplete="off"
                                                                    placeholder="Title"
                                                                    value={campContent[i].campTitle}
                                                                    onChange={(e)=>onChangeCamp(e,i)}
                                                                />
                                                                <textarea
                                                                    className="form-control"
                                                                    name="campDescription"
                                                                    id={"campDescription" + i}
                                                                    autoComplete="off"
                                                                    placeholder="Description"
                                                                    value={campContent[i].campDescription}
                                                                    onChange={(e)=>onChangeCamp(e,i)}
                                                                />
                                                            </div>
                                                            <div className="row card-body">
                                                                <div className="col-6 p-0">
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        name="campLatitude"
                                                                        placeholder="Write latitude"
                                                                        autoComplete="off"
                                                                        id={"campLatitude" + i}
                                                                        value={campContent[i].campLatitude}
                                                                        onChange={(e)=>onChangeCamp(e,i)}
                                                                    />
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        name="campLongitude"
                                                                        placeholder="Write longitude"
                                                                        autoComplete="off"
                                                                        id={"campLongitude" +i}
                                                                        value={campContent[i].campLongitude}
                                                                        onChange={(e)=>onChangeCamp(e,i)}
                                                                    />
                                                                </div>
                                                                <div className="col-6">
                                                                    <p id={"camp_latitude_span" + i}/>
                                                                    <p id={"camp_longitude_span" + i}/>
                                                                </div>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-outline-secondary"
                                                                onClick={()=>getPosition("camp_latitude_span" + i,"camp_longitude_span" + i)}
                                                            >Get current position</button>
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-outline-secondary"
                                                                onClick={()=>toggleCampPanel("campMap"+i,i)}
                                                            >Choose on map</button>
                                                        </div>
                                                        <div className="col-md-5">

                                                        </div>
                                                    </div>
                                                    <div id={"camp_MapPanel"+i} className="tripBlockPart">
                                                        {displayCampMap[i] && <div className="googleMapDiv">
                                                            <Map el1={"camp_latitude_span" + i} el2={"camp_longitude_span" + i} setMapPosition={setMapPosition}/>
                                                        </div>}
                                                    </div>
                                                </Fragment>}
                                            </Fragment>
                                        )
                                    })}
                                </div>}
                            </div>
                        </div>
                        <div className="text-center">
                            <button type="submit" className="btn btn-outline-primary btn-lg my-5">Submit</button>
                        </div>
                    </form>
                </Fragment>):null}
            </Fragment>)}
        </div>
    );
}

EditTrip.propTypes = {
    getTripById: PropTypes.func.isRequired,
    createTrip: PropTypes.func.isRequired,
    getAllProfilesExceptOwn: PropTypes.func.isRequired,
    trip: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    trips: state.trips,
    profile: state.profile
})

export default connect(mapStateToProps,{getTripById, getAllProfilesExceptOwn, createTrip})(EditTrip)