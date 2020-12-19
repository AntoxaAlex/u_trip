import React, {Fragment} from "react";
import 'react-image-crop/dist/ReactCrop.css'
import ReactCrop from "react-image-crop";
const CroppModal = ({open, onClose, stateName, imgSrc, imgCrop, cropName, selectedImgCrop, setImgCrop, onTripImageLoadedModal, onTripCropCompleteModal}) =>{
    if(!open) return null
    return(
        <div className="modalStyle">
            <div className="modalDivStyle">
                <button
                    type="button"
                    className="btn btn-sm btn-outline-dark float-right"
                    onClick={onClose}
                >
                    <i className="fas fa-times"/>
                </button>
                <div className="croper">
                    {imgSrc?(<Fragment>
                        <ReactCrop
                            src={imgSrc}
                            crop={selectedImgCrop}
                            ruleOfThirds
                            onImageLoaded={(image)=>onTripImageLoadedModal(image)}
                            onChange={newCrop => setImgCrop({...imgCrop, [cropName]: newCrop})}
                            onComplete={(crop)=>onTripCropCompleteModal(crop, stateName)}
                        />
                    </Fragment>):null }
                </div>
            </div>
        </div>
    )
}
export default CroppModal