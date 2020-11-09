import React, {useState, Fragment} from 'react';
import {connect} from "react-redux";
import {createTrip} from "../../actions/trips";
import axios from "axios";
import PropTypes from "prop-types";
import Map from "../map/Map";

const NewTrip = ({createTrip}) => {

    //===================================================State===================================================
    const[formData, setFormData]= useState({
        title: "",
        from: "",
        to: "",
        isCompleted: "",
        trip_description: ""
    });

    const[imageForm, setImage] =useState({
        tripImage: "",
        sp_image: "",
        fd_image: ""
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
        sp_latitude,
        sp_longitude
    } = stPointForm

    const {
        fd_title,
        fd_description,
        fd_latitude,
        fd_longitude
    } = fnDestinationForm


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

    //===================================================Map===================================================

    const togglePanel = (id, map) =>{
        if(!displayMap.id+"_map"){
            document.getElementById(id+"_block").style.width = "850px"
            document.getElementById(id+"_MapPanel").style.width = "500px"
            setMap({...displayMap, [map]: true})
        }
        // else{
        //     document.getElementById(id+"_block").style.width = "350px"
        //     document.getElementById(id+"_MapPanel").style.width = "0px"
        //     setMap({...displayMap, [map]: false})
        // }
    }

    const toggleCampPanel = (panel, block, i) => {

        setCampMap([...displayCampMap, false])

        if (displayCampMap.length > 0 && !displayCampMap[i]) {

            document.getElementById(block).style.width = "850px"
            document.getElementById(panel).style.width = "500px"
            const displayMap = [...displayCampMap];
            displayMap[i] = true;
            setCampMap(displayMap);

        }
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

        console.log(imageForm)
        console.log(title,
            from,
            isCompleted,
            to,
            trip_description)
        console.log("StPoint:  " + sp_title,
            sp_description,
            sp_image,
            sp_latitude,
            sp_longitude,
            )
        console.log("fnDest:   "+ fd_title,
            fd_description,
            fd_image,
            fd_latitude,
            fd_longitude)

        console.log(campContent)


        createTrip(
            tripImage,
            title,
            trip_description,
            from,
            to,
            isCompleted,
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
    }

    //===================================================JSX===================================================
    return (
        <div id="newTripDiv">
            <h1 className="text-center mb-5">Create New Trip</h1>
            <form onSubmit={e=>onSubmit(e)} encType="multipart/form-data">
                <div className="row">
                    <div id="tripMainImage" className="col-4 upload-image form-group">
                        <label htmlFor="tripImage" className="label">
                            <i className="far fa-file-image"></i>
                            <span className="title">Add image</span>
                            <input
                                type="file"
                                name="tripImage"
                                id="tripImage"
                                accept="image/*"
                                onChange={(e)=> onChangeImage(e)}
                            />
                        </label>
                    </div>
                    <div className="col-8">
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-control"
                                name="title"
                                id="title"
                                autoComplete="off"
                                placeholder="Title"
                                autoFocus
                                value={title}
                                onChange={(e)=>onChange(e)}
                            />
                        </div>
                        <div className="form-group">
                            <textarea
                                className="form-control"
                                name="trip_description"
                                id="description"
                                placeholder="Description"
                                value={trip_description}
                                onChange={(e)=>onChange(e)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="from">Start date</label>
                            <input
                                type="date"
                                className="form-control"
                                name="from"
                                id="from"
                                value={from}
                                onChange={(e)=>onChange(e)}
                            />
                        </div>
                        {isCompleted === "yes"  ?(
                            <div className="form-group">
                                <label htmlFor="to">End date</label>
                                <input
                                    type="date"
                                    className="form-control"
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
                        <p>Trip is completed?</p>
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
                </div>


                <div id="st_point_block" className="tripBlock">
                    <div className="card tripBlockPart" style={{width: 350, height:500}}>
                        <div id="tripImage" className="upload-image">
                            <div className="form-group">
                                <label htmlFor="sp_image" className="label">
                                    <i className="far fa-file-image"></i>
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
                        <div className="card-body">
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
                        <div className="dropdown-divider"/>
                        <div id="stPointPosition" className="card-body">
                            <div className="row">
                                <div className="col-6">
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
                                    <p id="sp_latitude_span"></p>
                                    <p id="sp_longitude_span"></p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={()=>getPosition("sp_latitude_span","sp_longitude_span")}
                            >Get current position</button>
                            <button
                                type="button"
                                onClick={()=>togglePanel("st_point", "st_point_map")}
                            >Choose on map</button>
                        </div>
                    </div>
                    <div id="st_point_MapPanel" className="tripBlockPart">
                        {displayMap.st_point_map && <div className="googleMapDiv">
                            <Map el1={"sp_latitude_span"} el2={"sp_longitude_span"} setMapPosition={setMapPosition}/>
                        </div>}
                    </div>
                </div>

                <div className="verticalLine"/>

                <div className="campBox">
                    {campContent.map((el, i)=>{
                        return(
                            <Fragment key={i}>
                                <div className="campGroup">
                                <div id={"camp_block"+i} className="tripBlock">
                                    <div className="card tripBlockPart" style={{width: 350, height:500}}>
                                        <div id="tripImage" className="upload-image">
                                            <div className="form-group">
                                                <label htmlFor={"campImage"+i} className="label">
                                                    <i className="far fa-file-image"></i>
                                                    <span className="title">Add image</span>
                                                    <input
                                                        type="file"
                                                        name="campImage"
                                                        id={"campImage"+i}
                                                        accept="image/*"
                                                        onChange={(e)=> onChangeCampImage(e,i)}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                        <div className="card-body">
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
                                        <div className="dropdown-divider"/>
                                        <div className="card-body campPositionDiv">
                                            <div className="row">
                                                <div className="col-6">
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
                                                    <p id={"camp_latitude_span" + i}></p>
                                                    <p id={"camp_longitude_span" + i}></p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={()=>getPosition("camp_latitude_span" + i,"camp_longitude_span" + i)}
                                            >Get current position</button>
                                            <button
                                                type="button"
                                                onClick={()=>toggleCampPanel("camp_MapPanel"+i,"camp_block"+i, i)}
                                            >Choose on map</button>
                                        </div>
                                    </div>
                                    <div id={"camp_MapPanel"+i} className="tripBlockPart">
                                        {displayCampMap[i] && <div className="googleMapDiv">
                                            <Map el1={"camp_latitude_span" + i} el2={"camp_longitude_span" + i} setMapPosition={setMapPosition}/>
                                        </div>}
                                    </div>
                                </div>
                                </div>
                                <div className="verticalLine"/>
                            </Fragment>
                        )
                    })}
                    <div className="text-center">
                        <button
                            id="addCampBtn"
                            className="btn btn-outline-success"
                            type="button"
                            onClick={()=>addCamp()}>
                            Add camp
                        </button>
                    </div>
                </div>
                <div className="verticalLine"/>



                <div id="fn_destination_block" className="tripBlock">
                    <div className="card tripBlockPart" style={{width: 350, height:500}}>
                        <div id="tripImage" className="upload-image">
                            <div className="form-group">
                                <label htmlFor="fd_image" className="label">
                                    <i className="far fa-file-image"></i>
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
                        <div className="card-body">
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
                        <div className="dropdown-divider"/>
                        <div id="fnDestinationPosition" className="card-body">
                            <div className="row">
                                <div className="col-6">
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
                                    <p id="fd_latitude_span"></p>
                                    <p id="fd_longitude_span"></p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={()=>getPosition("fd_latitude_span","fd_longitude_span")}
                            >Get current position</button>
                            <button
                                type="button"
                                onClick={()=>togglePanel("fn_destination", "fn_destination_map")}
                            >Choose on map</button>
                        </div>
                    </div>
                    <div id="fn_destination_MapPanel" className="tripBlockPart">
                        {displayMap.fn_destination_map && <div className="googleMapDiv">
                            <Map el1={"fd_latitude_span"} el2={"fd_longitude_span"} setMapPosition={setMapPosition}/>
                        </div>}
                    </div>
                </div>


                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
}

NewTrip.propTypes = {
    createTrip: PropTypes.func.isRequired,
    pos: PropTypes.object.isRequired
}

const mapStateToProps = state =>({
    pos: state.trips
})


export default connect(mapStateToProps, {createTrip})(NewTrip);