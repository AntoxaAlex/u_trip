import React, {useState, Fragment, useEffect} from 'react';
import {connect} from "react-redux";
import {createTrip} from "../../actions/trips";
import {getAllProfilesExceptOwn} from "../../actions/profile";
import PropTypes from "prop-types";

import FirstPart from "./newTripParts/FirstPart";
import SecondPart from "./newTripParts/SecondPart";
import ThirdPart from "./newTripParts/ThirdPart";
import FourthPart from "./newTripParts/FourthPart";

import 'react-image-crop/dist/ReactCrop.css';
import Spinner from "../layout/Spinner";
import {Redirect} from "react-router-dom";
import {ProgressBar} from "react-bootstrap";

const NewTrip = ({createTrip, getAllProfilesExceptOwn, profile:{profile, profiles, loading}, isCreated}) => {
    //===================================================State===================================================


    const[newTripPart, setNewTripPart] = useState({
        firstPart: true,
        secondPart: false,
        thirdPart: false,
        fourthPart: false
    })
    const[progressBar, setProgressBar] = useState(0)
    const[formData, setFormData]= useState({
        tripType: "",
        title: "",
        from: "",
        trip_description: ""
    });

    const[userProfiles, setProfiles] = useState([])
    const[teammates, setTeammates] = useState([])
    const [assembledTeammates, setAssembledTeammates] = useState([])

    const[displayList, setProfileList] =useState(false)

    const[isModalOpen, setOpen] = useState({
        tripModel: false,
        spModel: false,
        fdModel: false,
    })
    const[isCampModalOpen, setCampOpen] = useState([])


    useEffect(()=>{
        getAllProfilesExceptOwn()
            setProfiles(profiles)

    })

    const [crop, setCrop] = useState({
        tripImageCrop: {
            unit: "%",
            width: 30,
            aspect: 32 / 9
        },
        campImageCrop: {
            unit: "%",
            width: 30,
            aspect: 1
        }
    });

    const[imageForm, setImage] =useState({
        tripImgSrc: "",
        sp_imageSrc: "",
        fd_imageSrc: "",
        tripImage: "",
        sp_image: "",
        fd_image: ""
    });

    const [campImageCrop, setCampCrop] = useState([])

    const[stPointForm, setStartingPoint] =useState({
        sp_title: "",
        sp_description: "",
        sp_latitude: "",
        sp_longitude: ""
    });

    const[fnDestinationForm, setFinalDestination] =useState({
        fd_title: "",
        fd_description: "",
        fd_latitude: "",
        fd_longitude: ""
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


    //===================================================Add/Remove camp functions===================================================
    const addCamp = async () =>{

        setCamp([...campContent, {
            campTitle: "",
            campImage: "",
            campDescription: "",
            campLatitude: "",
            campLongitude: ""
        }])

        setCampOpen([...isCampModalOpen, false])


    }


    const removeCamp = index =>{
        const campList = [...campContent];
        campList.splice(index,1);
        setCamp(campList)
    }

    //===================================================Retrieve variables from state===================================================
    const {
        tripType,
        title,
        from,
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
        imgForm.append("name", name)
        imgForm.append("file", file)
        setImage({...imageForm, [name]:imgForm})
    }

    const uploadCampImages = async (file,index, name) =>{
        const campImageForm = new FormData()
        campImageForm.append("name", name)
        campImageForm.append("file", file)
        const campList = [...campContent];
        campList[index][name] = campImageForm
        setCamp(campList);
    }

    //===================================================Search teammates===================================================


    const searchTeammates = (e) => {
        const {value} = e.target;
        const selectedProfiles = [...userProfiles].filter(profile=>profile.user.firstname.toLowerCase().includes(value))
        setTeammates(selectedProfiles)
    }

    const addTeammate = (candidate) =>{
        if(assembledTeammates.filter(teammate=>teammate._id === candidate._id).length === 0){
            setAssembledTeammates([...assembledTeammates,candidate])
        }
    }

    const removeMember = (teammate, index) =>{
        const teammates = [...assembledTeammates]
        teammates.splice(index,1)
        setAssembledTeammates(teammates)
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

    const togglePanel = (map) =>{
        if(map === "st_point_map"){
            setMap({...displayMap, [map]: !displayMap.st_point_map})
        } else if(map === "fn_destination_map"){
            setMap({...displayMap, [map]: !displayMap.fn_destination_map})
        }
    }

    const toggleCampPanel = (map,i) => {

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

    const onChangeTripImage = async (e, id) =>{
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () =>{
                if(id === "tripImage"){
                    setImage({...imageForm, tripImgSrc: reader.result })
                    console.log(imageForm.tripImgSrc)
                } else if(id === "sp_image"){
                    setImage({...imageForm, sp_imageSrc: reader.result })
                    console.log(imageForm.sp_imageSrc)
                } else if(id === "fd_image"){
                    setImage({...imageForm, fd_imageSrc: reader.result })
                    console.log(imageForm.fd_imageSrc)
                } else{
                    setCampCrop([...campImageCrop, {
                        imgSrc: reader.result
                    }])
                }
            }
            );
            reader.readAsDataURL(e.target.files[0]);
        }



    }

    const onTripImageLoaded = (image, ref) => {
        setImage({...imageForm, [ref]: image})
    };

    const onCampImageLoaded = (image,index) =>{
        const campCropContent = [...campImageCrop]
        campCropContent[index].imgRef = image
        setCampCrop(campCropContent)
    }


    const onTripCropComplete = (crop, id, ref) => {
        console.log(ref)
        makeClientCrop(crop,id, ref);
    };

    const onCampCropComplete = (crop, id, index) => {
        makeClientCrop(crop,id, index);
    };

    const makeClientCrop = async (crop,id, ref) => {

        if(id === "tripImage" || id === "sp_image" || id === "fd_image" ){
            if (imageForm[ref] && crop.width && crop.height) {
                getCroppedImg(
                    imageForm[ref],
                    crop,
                    id
                );

            }
        } else {
            if (campImageCrop[ref].imgRef && crop.width && crop.height) {
                getCroppedImg(
                    campImageCrop[ref].imgRef,
                    crop,
                    id,
                    ref
                );

            }
        }
    }


    const getCroppedImg = (image, crop, id,ref) =>{
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
                dataURLtoFile(reader.result, 'avatar.jpg', id,ref)
            }
        })
    }

    const dataURLtoFile = (dataUrl, fileName, id,ref) =>{
        let arr = dataUrl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);

        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        let croppedImage = new File([u8arr], fileName, {type:mime});
        if(id === "tripImage" || id === "sp_image" || id === "fd_image" ){
            uploadImage(id, croppedImage)
        }else {
            uploadCampImages(croppedImage,ref,id)
        }

    }


    const onChangeStPoint = e => setStartingPoint({...stPointForm, [e.target.name]: e.target.value});
    const onChangeFnDestination = e => setFinalDestination({...fnDestinationForm, [e.target.name]: e.target.value});

    const onChangeCamp = (e,index) => {
        const {name, value} = e.target;
        const campList = [...campContent];
        campList[index][name] = value;
        setCamp(campList);
    }

    //===================================================Submit===================================================
    const onSubmit = e => {
        e.preventDefault();
        setProgressBar(100)
        setNewTripPart({...newTripPart, fourthPart: false})
        // createTrip(
        //     "",
        //     "create",
        //     tripImage,
        //     tripType,
        //     title,
        //     trip_description,
        //     from,
        //     assembledTeammates,
        //     sp_title,
        //     sp_description,
        //     sp_image,
        //     sp_latitude,
        //     sp_longitude,
        //     campContent,
        //     fd_title,
        //     fd_description,
        //     fd_image,
        //     fd_latitude,
        //     fd_longitude
        //     )
    }
    if(isCreated){
        return <Redirect to="/n/dashboard"/>
    }

    //===================================================JSX===================================================
    return (
        <Fragment>
            {profiles.length === 0 && loading  ? (<Spinner/>):(
                <div className="newTripDiv">
                    <h1 className="text-center my-5">Create trip</h1>
                    <form onSubmit={e=>onSubmit(e)} encType="multipart/form-data" className="container">
                        <ProgressBar  id="pb1" variant="warning" label={`${progressBar}%`} now={progressBar} className="mb-5"/>

                        <FirstPart
                            active={newTripPart.firstPart}
                            image={tripImage}
                            setOpen={setOpen}
                            isModalOpen={isModalOpen}
                            onChangeTripImage={(e,id)=>onChangeTripImage(e,id)}
                            imageForm={imageForm}
                            crop={crop}
                            setCrop={setCrop}
                            onTripImageLoaded={(image,ref)=>onTripImageLoaded(image,ref)}
                            onTripCropComplete={(crop, name, ref)=>onTripCropComplete(crop, name, ref)}
                            setProgressBar={(val)=> {
                                setProgressBar(val)
                                setNewTripPart({...newTripPart, firstPart: false, secondPart: true})
                            }}
                        />

                        <SecondPart
                            active={newTripPart.secondPart}
                            setProgressBar={(val)=> {
                                setProgressBar(val)
                                setNewTripPart({...newTripPart, secondPart: false, thirdPart: true})
                            }}
                            formData={formData}
                            onChange={(e)=>onChange(e)}
                            title={title}
                            trip_description={trip_description}
                            from={from}
                        />


                        <ThirdPart
                            active={newTripPart.thirdPart}
                            setProgressBar={(val)=> {
                                setProgressBar(val)
                                setNewTripPart({...newTripPart, thirdPart: false, fourthPart: true})
                            }}
                            searchTeammates={(e)=>searchTeammates(e)}
                            teammates={teammates}
                            displayList={displayList}
                            setProfileList={setProfileList}
                            addTeammate={(teammate)=>addTeammate(teammate)}
                            profile={profile}
                            assembledTeammates={assembledTeammates}
                            removeMember={(teammate, i)=>removeMember(teammate, i)}
                        />


                        <FourthPart
                            active={newTripPart.fourthPart}
                            addCamp={()=>addCamp()}
                            setDisplayedPoint={setDisplayedPoint}
                            campContent={campContent}
                            displayedPoint={displayedPoint}
                            sp_image={sp_image}
                            setOpen={setOpen}
                            isModalOpen={isModalOpen}
                            onChangeTripImage={(e,id)=>onChangeTripImage(e,id)}
                            sp_title={sp_title}
                            onChangeStPoint={(e)=>onChangeStPoint(e)}
                            sp_description={sp_description}
                            sp_latitude={sp_latitude}
                            sp_longitude={sp_longitude}
                            getPosition={(lat,lng)=>getPosition(lat,lng)}
                            togglePanel={(map)=>togglePanel(map)}
                            displayMap={displayMap}
                            setMapPosition={setMapPosition}
                            imageForm={imageForm}
                            crop={crop}
                            setCrop={setCrop}
                            onTripImageLoaded={(image, ref)=>onTripImageLoaded(image, ref)}
                            onTripCropComplete={(crop, name, ref)=>onTripCropComplete(crop, name, ref)}
                            fd_image={fd_image}
                            fd_title={fd_title}
                            onChangeFnDestination={(e)=>onChangeFnDestination(e)}
                            fd_description={fd_description}
                            fd_latitude={fd_latitude}
                            fd_longitude={fd_longitude}
                            isCampModalOpen={isCampModalOpen}
                            setCampOpen={setCampOpen}
                            removeCamp={(i)=>removeCamp(i)}
                            onChangeCamp={(e,i)=>onChangeCamp(e,i)}
                            toggleCampPanel={(map,i)=>toggleCampPanel(map, i)}
                            displayCampMap={displayCampMap}
                            campImageCrop={campImageCrop}
                            onCampImageLoaded={(image,i)=>onCampImageLoaded(image,i)}
                            onCampCropComplete={(crop, name,i)=>onCampCropComplete(crop, name, i)}
                            stPointForm={stPointForm}
                        />

                    </form>
                </div>
            )}
        </Fragment>

    );
}

NewTrip.propTypes = {
    createTrip: PropTypes.func.isRequired,
    getAllProfilesExceptOwn: PropTypes.func.isRequired,
    pos: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired
}

const mapStateToProps = state =>({
    pos: state.trips,
    profile: state.profile,
    isCreated: state.trips.isCreated
})


export default connect(mapStateToProps, {createTrip, getAllProfilesExceptOwn})(NewTrip);