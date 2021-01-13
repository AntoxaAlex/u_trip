import React, {Fragment, useEffect, useState} from "react";
import {connect} from "react-redux";
import CroppModal from "../../layout/CroppModal";
import TripMap from "../../map/TripMap";

const ThirdPart = ({
                        active,
                        addCamp,
                        setDisplayedPoint,
                        campContent,
                        displayedPoint,
                        sp_image,
                        setOpen,
                        isModalOpen,
                        onChangeTripImage,
                        sp_title,
                        onChangeStPoint,
                        onChangeSpPosition,
                        sp_description,
                        sp_latitude,
                        sp_longitude,
                        imageForm,
                        crop,
                        setCrop,
                        onTripImageLoaded,
                        onTripCropComplete,
                        fd_image,
                        fd_title,
                        onChangeFnDestination,
                        onChangeFdPosition,
                        fd_description,
                        fd_latitude,
                        fd_longitude,
                        isCampModalOpen,
                        setCampOpen,
                        removeCamp,
                        onChangeCamp,
                        onChangeCampPosition,
                        campImageCrop,
                        onCampImageLoaded,
                        onCampCropComplete,
                        stPointForm
                    }) =>{
    const[currentPosition, setCurrentPosition] = useState({
        lat: "",
        lng: ""
    })

    const[manualPosition, manualSetPosition] = useState({
        lat: "",
        lng: "",
        isOpen: false,
        isSubmitted: false
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

    const setPointPosition = (lat,lng) => {
        if(displayedPoint.val === "st_point"){
            onChangeSpPosition(lat, lng)
        }else if(displayedPoint.val === "fn_destination"){
            onChangeFdPosition(lat, lng)
        }else {
            onChangeCampPosition(lat,lng,displayedPoint.val)
        }
    }

    const getCurrentPosition = () =>{
        setPointPosition(currentPosition.lat,currentPosition.lng)
    }

    const submitManualPosition = () =>{
        manualSetPosition({...manualPosition, isSubmitted: true})
        if(manualPosition.isSubmitted) {
            setPointPosition(manualPosition.lat, manualPosition.lng)
            manualSetPosition({lat: "", lng: "", isSubmitted: false})
        }

    }

    if (!active) return null



    return(
        <div className="tripRouteDiv">
            <div className="tripHeader row">
                <div className="col-1 text-center">
                    <h5 className="headerNum">3</h5>
                </div>
                <div className="col-10">
                    <h5 className="text-left ml-3">Create route</h5>
                </div>
            </div>
            <div className="row">
                <div id="createMap" className="mb-3 col-12 col-lg-6 order-0">
                    {currentPosition.lat !== "" && currentPosition.lng !== "" && campContent && <TripMap
                        center={
                            displayedPoint.val === "st_point" && sp_latitude !== "" && sp_longitude !== "" ? {
                                lat: parseFloat(sp_latitude),
                                lng: parseFloat(sp_longitude)
                            } : (displayedPoint.val === "fn_destination" && fd_latitude !== "" && fd_longitude !== "" ? {
                                lat: parseFloat(fd_latitude),
                                lng: parseFloat(fd_longitude)
                            } : (campContent.filter((camp,i)=>parseFloat(displayedPoint.val) === i).length>0 && campContent[parseFloat(displayedPoint.val)].campLatitude !== "" && campContent[parseFloat(displayedPoint.val)].campLongitude !== "" ? {
                                lat: parseFloat(campContent[parseFloat(displayedPoint.val)].campLatitude),
                                lng: parseFloat(campContent[parseFloat(displayedPoint.val)].campLongitude)
                            } : {
                                lat: currentPosition.lat,
                                lng: currentPosition.lng
                            }))
                        }
                        mapType="create"
                        trip={{
                            sp_title: sp_title,
                            sp_latitude: sp_latitude,
                            sp_longitude: sp_longitude,
                            fd_title: fd_title,
                            fd_latitude: fd_latitude,
                            fd_longitude: fd_longitude,
                            campContent: campContent,
                            displayedPoint: displayedPoint
                        }}
                        setMapPosition={(lat, lng)=>setPointPosition(lat,lng)}
                    />}
                </div>
                <div className="routePlan p-3 col-12 col-lg-6 order-1">
                    <button
                        type="button"
                        className="btn btn-lg btn-outline-secondary addCampBtn"
                        onClick={()=>addCamp()}
                    >Add point</button>
                    <div className="routeTrack my-3">
                    <span className="waySpanRadio">
                        <input
                            type="radio"
                            value="st_point"
                            name="displayedPoint"
                            onClick={(e)=> {
                                setDisplayedPoint({val: e.target.value})
                                manualSetPosition({lat: "", lng: "", isOpen: false,isSubmitted: false})
                            }}
                        />
                    </span>
                        <div className="pointRadiosDiv">
                            {campContent.map((camp,i)=>{
                                return(
                                    <Fragment key={i}>
                                    <span className="waySpanRadio">---
                                        <input
                                            type="radio"
                                            value={i}
                                            name="displayedPoint"
                                            onClick={(e)=> {
                                                setDisplayedPoint({val: e.target.value})
                                                manualSetPosition({lat: "", lng: "", isOpen: false, isSubmitted: false})
                                            }}
                                        />
                                    </span>
                                    </Fragment>
                                )
                            })}
                        </div>
                        <span className="waySpanRadio">---
                        <input
                            type="radio"
                            name="displayedPoint"
                            value="fn_destination"
                            onClick={(e)=> {
                                setDisplayedPoint({val: e.target.value})
                                manualSetPosition({lat: "", lng: "", isOpen: false, isSubmitted: false})
                            }}
                        />
                    </span>
                    </div>
                    {displayedPoint !== null &&
                    <div className="card mb-3" >
                        {displayedPoint.val === "st_point"  ?(
                            <div>
                                <h3 className="ml-2">Starting Point</h3>
                                <div className="row no-gutters">
                                    <div className="col-md-5">
                                        <div id="tripImage" className="upload-image">
                                            <div className="form-group">
                                                <label htmlFor="sp_image" className="label">
                                                    {sp_image !== "" ? (<Fragment>
                                                            <i className="fas fa-check"/>
                                                            <span className="title">Image loaded</span>
                                                        </Fragment>
                                                    ) : (<Fragment>
                                                            <i className="far fa-file-image"/>
                                                            <span className="title">Add image</span>
                                                        </Fragment>
                                                    )}
                                                    <input
                                                        type="file"
                                                        name="sp_image"
                                                        id="sp_image"
                                                        accept="image/*"
                                                        onChange={(e)=>{
                                                            setOpen({...isModalOpen, spModel: true})
                                                            onChangeTripImage(e, "sp_image")
                                                        }}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-7">
                                        <div className="card-body p-0 mb-3">
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="sp_title"
                                                id="sp_title"
                                                spellCheck="false"
                                                autoComplete="off"
                                                placeholder="Title"
                                                value={sp_title}
                                                onChange={(e)=>onChangeStPoint(e.target.name, e.target.value)}
                                            />
                                            <textarea
                                                className="form-control"
                                                name="sp_description"
                                                id="sp_description"
                                                spellCheck="false"
                                                autoComplete="off"
                                                placeholder="Description"
                                                value={sp_description}
                                                onChange={(e)=>onChangeStPoint(e.target.name, e.target.value)}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-secondary"
                                            onClick={()=>getCurrentPosition()}
                                        >Get current position</button>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-secondary"
                                            onClick={()=>manualSetPosition({...manualPosition, isOpen: !manualPosition.isOpen})}
                                        >Set manual position</button>
                                    </div>
                                    {manualPosition.isOpen && <div className="row pt-5">
                                        <div className="d-none d-md-block col-sm-6">
                                            <p>Latitude</p>
                                            <p>Longitude</p>
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="sp_latitude"
                                                placeholder="Write latitude"
                                                autoComplete="off"
                                                id="sp_latitude"
                                                onChange={(e)=>manualSetPosition({...manualPosition, lat: e.target.value})}
                                            />
                                            <input
                                                type="text"
                                                className="form-control mb-2"
                                                name="sp_longitude"
                                                placeholder="Write longitude"
                                                autoComplete="off"
                                                id="sp_longitude"
                                                onChange={(e)=>manualSetPosition({...manualPosition, lng: e.target.value})}
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-secondary"
                                                onClick={()=>submitManualPosition()}
                                            >Submit manual position</button>
                                        </div>
                                    </div>}
                                </div>
                                <CroppModal
                                    open={isModalOpen.spModel}
                                    onClose={()=>setOpen({...isModalOpen, spModel: false})}
                                    stateName = "sp_image"
                                    imgSrc={imageForm.sp_imageSrc}
                                    imgCrop={crop}
                                    cropName="campImageCrop"
                                    selectedImgCrop={crop.campImageCrop}
                                    setImgCrop={setCrop}
                                    onTripImageLoadedModal={(image)=>onTripImageLoaded(image,"spImageRef")}
                                    onTripCropCompleteModal={(crop, name)=>onTripCropComplete(crop, name, "spImageRef")}
                                />

                            </div>
                        ):null}
                        {displayedPoint.val === "fn_destination" && <div>
                            <h3 className="ml-2">Final Destination</h3>
                            <div className="row no-gutters">
                                <div className="col-md-5">
                                    <div id="tripImage" className="upload-image">
                                        <div className="form-group">
                                            <label htmlFor="fd_image" className="label">
                                                {fd_image !== "" ? (<Fragment>
                                                        <i className="fas fa-check"/>
                                                        <span className="title">Image loaded</span>
                                                    </Fragment>
                                                ) : (<Fragment>
                                                        <i className="far fa-file-image"/>
                                                        <span className="title">Add image</span>
                                                    </Fragment>
                                                )}
                                                <input
                                                    type="file"
                                                    name="fd_image"
                                                    id="fd_image"
                                                    accept="image/*"
                                                    onChange={(e)=> {
                                                        setOpen({...isModalOpen, fdModel: true})
                                                        onChangeTripImage(e, "fd_image")
                                                    }}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-7">
                                    <div className="card-body p-0">
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="fd_title"
                                            spellCheck="false"
                                            id="fd_title"
                                            autoComplete="off"
                                            placeholder="Title"
                                            value={fd_title}
                                            onChange={(e)=>onChangeFnDestination(e.target.name, e.target.value)}
                                        />
                                        <textarea
                                            className="form-control"
                                            name="fd_description"
                                            id="fd_description"
                                            spellCheck="false"
                                            autoComplete="off"
                                            placeholder="Description"
                                            value={fd_description}
                                            onChange={(e)=>onChangeFnDestination(e.target.name, e.target.value)}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={()=>getCurrentPosition()}
                                    >Get current position</button>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={()=>manualSetPosition({...manualPosition, isOpen: !manualPosition.isOpen})}
                                    >Set manual position</button>
                                </div>
                                {manualPosition.isOpen && <div className="row pt-5">
                                    <div className="d-none d-md-block col-sm-6">
                                        <p>Latitude</p>
                                        <p>Longitude</p>
                                    </div>
                                    <div className="col-12 col-md-6 p-0">
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="fd_latitude"
                                            placeholder="Write latitude"
                                            autoComplete="off"
                                            id="fd_latitude"
                                            onChange={(e)=>manualSetPosition({...manualPosition, lat: e.target.value})}
                                        />
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="fd_longitude"
                                            placeholder="Write longitude"
                                            autoComplete="off"
                                            id="fd_longitude"
                                            onChange={(e)=>manualSetPosition({...manualPosition, lng: e.target.value})}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={()=>submitManualPosition()}
                                    >Submit manual position</button>
                                </div>}
                                <CroppModal
                                    open={isModalOpen.fdModel}
                                    onClose={()=>setOpen({...isModalOpen, fdModel: false})}
                                    stateName = "fd_image"
                                    imgSrc={imageForm.fd_imageSrc}
                                    imgCrop={crop}
                                    cropName="campImageCrop"
                                    selectedImgCrop={crop.campImageCrop}
                                    setImgCrop={setCrop}
                                    onTripImageLoadedModal={(image)=>onTripImageLoaded(image,"fdImageRef")}
                                    onTripCropCompleteModal={(crop, name)=>onTripCropComplete(crop, name, "fdImageRef")}
                                />
                            </div>
                        </div>}
                        {campContent.map((el,i)=>{
                            return(
                                <Fragment key={i}>
                                    {displayedPoint.val == i && <div>
                                        <h3 className="ml-2">Camp {i+1}</h3>
                                        <div className="row no-gutters">
                                            <div className="col-md-5 text-center">
                                                <div id="tripImage" className="upload-image">
                                                    <div className="form-group">
                                                        <label htmlFor={"campImage"+i} className="label">
                                                            {campContent[i].campImage !== "" ? (<Fragment>
                                                                    <i className="fas fa-check"/>
                                                                    <span className="title">Image loaded</span>
                                                                </Fragment>
                                                            ) : (<Fragment>
                                                                    <i className="far fa-file-image"/>
                                                                    <span className="title">Add image</span>
                                                                </Fragment>
                                                            )}
                                                            <input
                                                                type="file"
                                                                name="campImage"
                                                                id={"campImage"+i}
                                                                accept="image/*"
                                                                onChange={ (e)=> {
                                                                    const modalList = [...isCampModalOpen];
                                                                    modalList[i] = true
                                                                    setCampOpen(modalList)
                                                                    onChangeTripImage(e,i)

                                                                }}
                                                            />
                                                        </label>
                                                    </div>
                                                </div>
                                                <button type="button"
                                                        className="btn btn-sm btn-outline-danger" onClick={()=>removeCamp(i)}>
                                                    Delete camp
                                                </button>
                                            </div>
                                            <div className="col-md-7">
                                                <div className="card-body p-0">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="campTitle"
                                                        id={"campTitle" + i}
                                                        autoComplete="off"
                                                        spellCheck="false"
                                                        placeholder="Title"
                                                        value={campContent[i].campTitle}
                                                        onChange={(e)=>onChangeCamp(e.target.name, e.target.value, i)}
                                                    />
                                                    <textarea
                                                        className="form-control"
                                                        name="campDescription"
                                                        id={"campDescription" + i}
                                                        spellCheck="false"
                                                        autoComplete="off"
                                                        placeholder="Description"
                                                        value={campContent[i].campDescription}
                                                        onChange={(e)=>onChangeCamp(e.target.name, e.target.value, i)}
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-secondary"
                                                    onClick={()=>getCurrentPosition()}
                                                >Get current position</button>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-secondary"
                                                    onClick={()=>manualSetPosition({...manualPosition, isOpen: !manualPosition.isOpen})}
                                                >Set manual position</button>
                                            </div>
                                        </div>
                                        {manualPosition.isOpen && <div className="row pt-5">
                                            <div className="d-none d-md-block col-sm-6">
                                                <p>Latitude</p>
                                                <p>Longitude</p>
                                            </div>
                                            <div className="col-12 col-md-6 p-0">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="campLatitude"
                                                    placeholder="Write latitude"
                                                    autoComplete="off"
                                                    id={"campLatitude" + i}
                                                    onChange={(e)=>manualSetPosition({...manualPosition, lat: e.target.value})}
                                                />
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="campLongitude"
                                                    placeholder="Write longitude"
                                                    autoComplete="off"
                                                    id={"campLongitude" +i}
                                                    onChange={(e)=>manualSetPosition({...manualPosition, lng: e.target.value})}
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-secondary"
                                                onClick={()=>submitManualPosition()}
                                            >Submit manual position</button>
                                        </div>}
                                        {campImageCrop[i]?(
                                            <CroppModal
                                                open={isCampModalOpen[i]}
                                                onClose={()=>{
                                                    const campOpenList = [...isCampModalOpen]
                                                    campOpenList[i] = false
                                                    setCampOpen(campOpenList)
                                                }}
                                                stateName = "campImage"
                                                imgSrc={campImageCrop[i].imgSrc}
                                                imgCrop={crop}
                                                cropName="campImageCrop"
                                                selectedImgCrop={crop.campImageCrop}
                                                setImgCrop={setCrop}
                                                onTripImageLoadedModal={(image)=>onCampImageLoaded(image, i)}
                                                onTripCropCompleteModal={(crop, name)=>onCampCropComplete(crop, name, i)}
                                            />
                                        ):null
                                        }
                                    </div>}
                                </Fragment>
                            )
                        })}
                    </div>}
                </div>
            </div>
            {stPointForm.sp_title !=="" && stPointForm.sp_description !=="" && stPointForm.sp_latitude !=="" && stPointForm.sp_longitude !=="" && imageForm.sp_image && <button
                type="submit"
                className="btn btn-outline-primary btn-lg my-5 btnNextPart"
                >
                Next
            </button>}
        </div>
    )
}

export default connect()(ThirdPart)