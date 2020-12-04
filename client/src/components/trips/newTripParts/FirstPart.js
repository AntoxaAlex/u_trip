import React from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import CroppModal from "../../layout/CroppModal";

const FirstPart = ({active, image, setOpen, isModalOpen, onChangeTripImage, imageForm, crop, setCrop, onTripImageLoaded, onTripCropComplete, setProgressBar}) =>{
    if (!active) return null
    return(
        <div className="tripMainImageDiv mb-5">
            <div className="tripHeader row">
                <div className="col-1 text-center">
                    <h1 className="headerNum">1</h1>
                </div>
                <h1 className="text-left col-11">Upload main image of your trip</h1>
            </div>
            <label id="tripImageLabel" htmlFor="tripImage" className="label">
                {image !== "" ? (
                    <p className="title">Image loaded <i className="fas fa-check"/></p>
                ) : (
                    <p className="title"><i className="far fa-file-image"/> Upload image</p>
                )}
                <input
                    type="file"
                    name="tripImage"
                    id="tripImage"
                    accept="image/*"
                    onChange={(e)=>{
                        setOpen({...isModalOpen, tripModel: true})
                        onChangeTripImage(e, "tripImage")
                    }}
                />
            </label>
            <CroppModal
                open={isModalOpen.tripModel}
                onClose={()=> {
                    setOpen({...isModalOpen, tripModel: false})
                }}
                stateName = "tripImage"
                imgSrc={imageForm.tripImgSrc}
                imgCrop={crop}
                cropName="tripImageCrop"
                selectedImgCrop={crop.tripImageCrop}
                setImgCrop={setCrop}
                onTripImageLoadedModal={(image)=>onTripImageLoaded(image,"tripImgRef")}
                onTripCropCompleteModal={(crop, name)=>onTripCropComplete(crop, name, "tripImgRef")}
            />
            {imageForm.tripImage !== "" && <button
                type="button"
                className="btn-outline-primary"
                onClick={()=>{
                    setProgressBar(25)
                }}
            >
                Next
            </button>}

        </div>
    )
}

export default connect()(FirstPart)
