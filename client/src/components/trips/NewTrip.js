import React, {useState, Fragment, useEffect} from 'react';
import {connect} from "react-redux";
import {getTripById,createTrip} from "../../actions/trips";
import {getAllProfilesExceptOwn} from "../../actions/profile";
import PropTypes from "prop-types";

import FirstPart from "./newTripParts/FirstPart";
import SecondPart from "./newTripParts/SecondPart";
import ThirdPart from "./newTripParts/ThirdPart";

import Spinner from "../layout/Spinner";
import {Redirect} from "react-router-dom";
import {ProgressBar} from "react-bootstrap";
import axios from "axios";
import {useParams} from "react-router";

const NewTrip = ({getTripById,createTrip, getAllProfilesExceptOwn, profile:{profile, profiles, loading}, isCreated,trips:{trip},tripsLoading}) => {
    //===================================================State===================================================
    const {id} = useParams()

    const[newTripPart, setNewTripPart] = useState({
        firstPart: true,
        secondPart: false,
        thirdPart: false,
    })
    const[progressBar, setProgressBar] = useState(0)
    const[formData, setFormData]= useState({
        tripType: "",
        title: "",
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
        if(id){
            getTripById(id)
        }
        if(trip){
            setFormData({
                tripType: loading || !trip.type ? "" : trip.type,
                title: loading || !trip.title ? "" : trip.title,
                trip_description: loading || !trip.trip_description ? "" : trip.trip_description
            })
            setAssembledTeammates(loading || !trip.team ? null : trip.team)
            setImage({
                sp_image: loading || !trip.st_point.sp_image ? "" : trip.st_point.sp_image,
                fd_image: loading || !trip.fn_destination.fd_image ? "" : trip.fn_destination.fd_image
            })
            setStartingPoint({
                sp_title: loading || !trip.st_point.sp_title ? "" : trip.st_point.sp_title,
                sp_description: loading || !trip.st_point.sp_description ? "" : trip.st_point.sp_description,
                isSpReached: loading || !trip.st_point.isSpReached ? false : trip.st_point.isSpReached
            })
            setFinalDestination({
                fd_title: loading || !trip.fn_destination.fd_title ? "" : trip.fn_destination.fd_title,
                fd_description: loading || !trip.fn_destination.fd_description ? "" : trip.fn_destination.fd_description,
                isFdReached: loading || !trip.fn_destination.isFdReached ? false : trip.fn_destination.isFdReached
            })
            setSpPosition({
                sp_latitude: loading || !trip.st_point.sp_latitude ? "" : trip.st_point.sp_latitude,
                sp_longitude: loading || !trip.st_point.sp_longitude ? "" : trip.st_point.sp_longitude
            })
            setFdPosition({
                fd_latitude: loading || !trip.fn_destination.fd_latitude ? "" : trip.fn_destination.fd_latitude,
                fd_longitude: loading || !trip.fn_destination.fd_longitude ? "" : trip.fn_destination.fd_longitude,
            })

            setCamp(loading || !trip.campContent.length === 0 ? [] : trip.campContent)
        }
        getAllProfilesExceptOwn()
        setProfiles(profiles)
    },[loading, tripsLoading])

    const [crop, setCrop] = useState({
        campImageCrop: {
            unit: "%",
            width: 30,
            aspect: 1
        }
    });

    const[imageForm, setImage] =useState({
        sp_imageSrc: "",
        fd_imageSrc: "",
        sp_image: "",
        fd_image: ""
    });

    const [campImageCrop, setCampCrop] = useState([])

    const[stPointForm, setStartingPoint] =useState({
        sp_title: "",
        sp_description: "",
        isSpReached: false
    });
    const[stPosition, setSpPosition] = useState({
        sp_latitude: "",
        sp_longitude: ""
    })

    const[fnDestinationForm, setFinalDestination] =useState({
        fd_title: "",
        fd_description: "",
        isFdReached: false
    });
    const[fdPosition, setFdPosition] = useState({
        fd_latitude: "",
        fd_longitude: ""
    })

    const[campContent, setCamp] =useState([]);

    const [displayedPoint, setDisplayedPoint] = useState({
        val: "st_point"
    })





    //===================================================Add/Remove camp functions===================================================
    const addCamp = async () =>{

        setCamp([...campContent, {
            campImage: "",
            campTitle: "",
            campDescription: "",
            campLatitude: "",
            campLongitude: "",
            isCampReached: false
        }])

        setCampOpen([...isCampModalOpen, false])


    }


    const removeCamp = index =>{
        const campList = [...campContent];
        campList.splice(index,1);
        setCamp(campList)
        setDisplayedPoint({val: "st_point"})

    }

    //===================================================Retrieve variables from state===================================================
    const {
        tripType,
        title,
        trip_description
    } = formData;

    const {
        sp_image,
        fd_image
    } = imageForm

    const{
        sp_title,
        sp_description,
        isSpReached
    } = stPointForm

    const{
        sp_latitude,
        sp_longitude
    } = stPosition

    const {
        fd_title,
        fd_description,
        isFdReached
    } = fnDestinationForm

    const {
        fd_latitude,
        fd_longitude
    } = fdPosition


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
        const campImageUrl = await axios.post("/trips/uploadImage", campImageForm)
        const campList = [...campContent];
        campList[index][name] = campImageUrl.data
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
            setAssembledTeammates([...assembledTeammates,{
                _id: candidate._id,
                user: candidate.user._id,
                imageUrl: candidate.imageUrl,
                firstname: candidate.user.firstname,
                secondname: candidate.user.secondname,
                level: candidate.level,
                status: candidate.status,
                tripdays: candidate.tripdays,
                isReady: false
            }])
        }
    }

    const removeMember = (teammate, index) =>{
        const teammates = [...assembledTeammates]
        teammates.splice(index,1)
        setAssembledTeammates(teammates)
    }



    //===================================================Map===================================================

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
                if(id === "sp_image"){
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

        if(id === "sp_image" || id === "fd_image" ){
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
        if(id === "sp_image" || id === "fd_image" ){
            uploadImage(id, croppedImage)
        }else {
            uploadCampImages(croppedImage,ref,id)
        }

    }


    const onChangeStPoint = (name,value) => setStartingPoint({...stPointForm, [name]: value});
    const onChangeSpPosition = (lat, lng) => setSpPosition({...stPosition,sp_latitude: lat,sp_longitude: lng})

    const onChangeFnDestination = (name,value) => setFinalDestination({...fnDestinationForm, [name]: value});
    const onChangeFdPosition = (lat, lng) => setFdPosition({...fdPosition, fd_latitude: lat,fd_longitude: lng})

    const onChangeCamp = (name,value, index) => {
        const campList = [...campContent];
        campList[index][name] = value;
        setCamp(campList);
    }

    const onChangeCampPosition = (lat,lng,index) =>{
        const campList = [...campContent];
        campList[index].campLatitude = lat;
        campList[index].campLongitude = lng;
        setCamp(campList);
    }

    //===================================================Submit===================================================
    const onSubmit = e => {
        e.preventDefault();
        setProgressBar(100)
        setNewTripPart({...newTripPart, thirdPart: false})
        createTrip(
            id,
            id === undefined ? "create" : "edit",
            tripType,
            title,
            trip_description,
            assembledTeammates,
            sp_image,
            sp_title,
            sp_description,
            sp_latitude,
            sp_longitude,
            isSpReached,
            fd_image,
            fd_title,
            fd_description,
            fd_latitude,
            fd_longitude,
            isFdReached,
            campContent
            )
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
                        <ProgressBar  id="pb1" variant="warning" label={`${progressBar}%`} animated now={progressBar} className="mb-5 bg-secondary"/>
                        {newTripPart.firstPart || newTripPart.secondPart  ? (<div id="tripPartDiv" className="text-center">
                            <FirstPart
                                active={newTripPart.firstPart}
                                formData={formData}
                                onChange={(e)=>onChange(e)}
                                title={title}
                                trip_description={trip_description}
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
                                searchTeammates={(e)=>searchTeammates(e)}
                                teammates={teammates}
                                displayList={displayList}
                                addTeammate={(teammate)=>addTeammate(teammate)}
                                profile={profile}
                                assembledTeammates={assembledTeammates}
                                removeMember={(teammate, i)=>removeMember(teammate, i)}
                            />
                        </div>) :( newTripPart.thirdPart ? (<div id="thirdPartDiv" className="text-center">
                            <ThirdPart
                                active={newTripPart.thirdPart}
                                addCamp={()=>addCamp()}
                                setDisplayedPoint={setDisplayedPoint}
                                campContent={campContent}
                                displayedPoint={displayedPoint}
                                sp_image={sp_image}
                                setOpen={setOpen}
                                isModalOpen={isModalOpen}
                                onChangeTripImage={(e,id)=>onChangeTripImage(e,id)}
                                sp_title={sp_title}
                                onChangeStPoint={(name,value)=>onChangeStPoint(name,value)}
                                onChangeSpPosition={(lat,lng)=>onChangeSpPosition(lat,lng)}
                                sp_description={sp_description}
                                sp_latitude={sp_latitude}
                                sp_longitude={sp_longitude}
                                setMapPosition={setMapPosition}
                                imageForm={imageForm}
                                crop={crop}
                                setCrop={setCrop}
                                onTripImageLoaded={(image, ref)=>onTripImageLoaded(image, ref)}
                                onTripCropComplete={(crop, name, ref)=>onTripCropComplete(crop, name, ref)}
                                fd_image={fd_image}
                                fd_title={fd_title}
                                onChangeFnDestination={(name,value)=>onChangeFnDestination(name,value)}
                                onChangeFdPosition={(lat,lng)=>onChangeFdPosition(lat,lng)}
                                fd_description={fd_description}
                                fd_latitude={fd_latitude}
                                fd_longitude={fd_longitude}
                                isCampModalOpen={isCampModalOpen}
                                setCampOpen={setCampOpen}
                                removeCamp={(i)=>removeCamp(i)}
                                onChangeCamp={(name,value,i)=>onChangeCamp(name,value,i)}
                                onChangeCampPosition={(lat, lng,i)=>onChangeCampPosition(lat,lng,i)}
                                campImageCrop={campImageCrop}
                                onCampImageLoaded={(image,i)=>onCampImageLoaded(image,i)}
                                onCampCropComplete={(crop, name,i)=>onCampCropComplete(crop, name, i)}
                                stPointForm={stPointForm}
                            />
                            </div>) : <Spinner/>)}
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
    profile: PropTypes.object.isRequired,
    trips: PropTypes.object.isRequired,
    tripsLoading: PropTypes.bool.isRequired
}

const mapStateToProps = state =>({
    pos: state.trips,
    profile: state.profile,
    isCreated: state.trips.isCreated,
    trips: state.trips,
    tripsLoading: state.trips.loading
})


export default connect(mapStateToProps, {createTrip, getAllProfilesExceptOwn,getTripById})(NewTrip);