import React, {Fragment} from "react";
import ReactCrop from "react-image-crop";
import 'react-image-crop/dist/ReactCrop.css'
const ProfileCroppModal = ({open, onClose, src, crop, setImgCrop, onImageLoadedModal, onCropCompleteModal}) =>{
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
                    {src?(<Fragment>
                        <ReactCrop
                            src={src}
                            crop={crop}
                            ruleOfThirds
                            onImageLoaded={(image)=>onImageLoadedModal(image)}
                            onChange={newCrop => setImgCrop(newCrop)}
                            onComplete={(crop)=>onCropCompleteModal(crop)}
                        />
                    </Fragment>):null }
                </div>
            </div>
        </div>
    )
}
export default ProfileCroppModal