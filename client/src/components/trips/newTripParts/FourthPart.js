import React, {Fragment} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import Map from "../../map/Map";
import CroppModal from "../../layout/CroppModal";

const FourthPart = ({
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
                        sp_description,
                        sp_latitude,
                        sp_longitude,
                        getPosition,
                        togglePanel,
                        displayMap,
                        setMapPosition,
                        imageForm,
                        crop,
                        setCrop,
                        onTripImageLoaded,
                        onTripCropComplete,
                        fd_image,
                        fd_title,
                        onChangeFnDestination,
                        fd_description,
                        fd_latitude,
                        fd_longitude,
                        isCampModalOpen,
                        setCampOpen,
                        removeCamp,
                        onChangeCamp,
                        toggleCampPanel,
                        displayCampMap,
                        campImageCrop,
                        onCampImageLoaded,
                        onCampCropComplete,
                        stPointForm
                    }) =>{
    if (!active) return null
    return(
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
                                    <span className="waySpanRadio">
                                        <input
                                            type="radio"
                                            value="st_point"
                                            name="displayedPoint"
                                            onClick={(e)=>setDisplayedPoint({val: e.target.value})}
                                        />
                                    </span>
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
                {displayedPoint !== null &&
                <div className="card mb-3" >
                    {displayedPoint.val === "st_point"  ?(
                        <div>
                            <h3 className="ml-2">Starting Point</h3>
                            <div className="row no-gutters">
                                <div className="col-md-3">
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
                                <div className="col-md-4">
                                    <div className="card-body p-0">
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="sp_title"
                                            id="sp_title"
                                            spellCheck="false"
                                            autoComplete="off"
                                            placeholder="Title"
                                            value={sp_title}
                                            onChange={(e)=>onChangeStPoint(e)}
                                        />
                                        <textarea
                                            className="form-control"
                                            name="sp_description"
                                            id="sp_description"
                                            spellCheck="false"
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
                            <div className="col-md-3">
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
                            <div className="col-md-4">
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
                                        onChange={(e)=>onChangeFnDestination(e)}
                                    />
                                    <textarea
                                        className="form-control"
                                        name="fd_description"
                                        id="fd_description"
                                        spellCheck="false"
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
                        {displayMap.fn_destination_map && <div className="googleMapDiv fn_destination_MapPanel">
                            <Map el1={"fd_latitude_span"} el2={"fd_longitude_span"} setMapPosition={setMapPosition}/>
                        </div>}
                    </div>}
                    {campContent.map((el,i)=>{
                        return(
                            <Fragment key={i}>
                                {displayedPoint.val === "camp"+i && <div>
                                    <h3 className="ml-2">Camp {i+1}</h3>
                                    <div className="row no-gutters">
                                        <div className="col-md-3 text-center">
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
                                        <div className="col-md-4">
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
                                                    onChange={(e)=>onChangeCamp(e,i)}
                                                />
                                                <textarea
                                                    className="form-control"
                                                    name="campDescription"
                                                    id={"campDescription" + i}
                                                    spellCheck="false"
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
            {stPointForm.sp_title !=="" && stPointForm.sp_description !=="" && stPointForm.sp_latitude !=="" && stPointForm.sp_longitude !=="" && imageForm.sp_image && <button
                type="submit"
                className="btn btn-outline-primary btn-lg my-5"
                >
                Next
            </button>}
        </div>
    )
}

export default connect()(FourthPart)