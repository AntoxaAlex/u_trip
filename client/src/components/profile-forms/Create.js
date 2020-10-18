import React, {useState, Fragment} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {createProfile} from "../../actions/profile";

const Create = ({createProfile, profile:{profile}}) => {
    const[formData, setFormData]= useState({
        dob: "",
        place: "",
        job: "",
        tripdays: "",
        preferences: "",
        gender: "",
        bio: "",
        instagram: "",
        facebook: "",
        vk: "",
        pinterest: "",
        website: "",
        date: ""
    })

    const[avatarFile, setAvatar] = useState({
        avatar: ""
    })

    const[displayLinks, toggleLinks] = useState(false)

    const {
        dob,
        place,
        job,
        tripdays,
        preferences,
        gender,
        bio,
        instagram,
        facebook,
        vk,
        pinterest,
        website,
        date
    } = formData;

    const {avatar} = avatarFile



    const onChange = e => setFormData({...formData, [e.target.name]: e.target.value});
    const onSubmit = e => {
        e.preventDefault();
        const imageForm = new FormData()
        imageForm.append('avatar', avatar[0])
        createProfile(
            imageForm,
            dob,
            place,
            job,
            tripdays,
            preferences,
            gender,
            bio,
            instagram,
            facebook,
            vk,
            pinterest,
            website,
            date
        )

        // if(profile.isUpdated === true){
        //     return <Redirect to="/profile/me"/>
        // }
    }
    return(
        <Fragment>
            <h2>Create profile</h2>
            <form encType="multipart/form-data" onSubmit={e=>onSubmit(e)}>
                <div className="upload-image">
                    <div className="form-group">
                        <label htmlFor="image" className="label">
                            <i className="far fa-file-image"></i>
                            <span className="title">Add avatar</span>
                            <input
                                type="file"
                                id="image"
                                name="avatar"
                                accept="image/*"
                                onChange={(e)=>{setAvatar({...avatarFile,[e.target.name]: [e.target.files[0]]})}}
                                required
                            />
                        </label>
                    </div>
                </div>
                <div className="form-group">
                    <input
                        type="date"
                        className="form-control"
                        name="dob"
                        id="dob"
                        autoComplete="off"
                        placeholder="Date of birth"
                        value={dob}
                        onChange={(e)=>onChange(e)}
                    />
                    <small className="form-text">Please tell us your date of birth in such format - dd.mm.yyyy</small>
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        className="form-control"
                        name="place"
                        id="place"
                        autoComplete="off"
                        placeholder="Place of residence"
                        value={place}
                        onChange={(e)=>onChange(e)}
                    />
                    <small className="form-text">Where are you living?</small>
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        className="form-control"
                        name="job"
                        id="job"
                        autoComplete="off"
                        placeholder="Job"
                        value={job}
                        onChange={(e)=>onChange(e)}
                    />
                    <small className="form-text">Please tell us your actual job</small>
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        className="form-control"
                        name="tripdays"
                        id="tripdays"
                        autoComplete="off"
                        placeholder="Days in trip"
                        value={tripdays}
                        onChange={(e)=>onChange(e)}
                    />
                    <small className="form-text">How many days have you already been in trips</small>
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        className="form-control"
                        name="preferences"
                        id="preferences"
                        autoComplete="off"
                        placeholder="Preferences"
                        value={preferences}
                        onChange={(e)=>onChange(e)}
                    />
                    <small className="form-text">Please use coma separated values (eg. Fishing, snowboarding, rope-jumping)</small>
                </div>
                <div className="form-group">
                    <textarea
                        className="form-control"
                        name="bio"
                        id="bio"
                        autoComplete="off"
                        placeholder="Bio"
                        value={bio}
                        onChange={(e)=>onChange(e)}
                    />
                    <small className="form-text">Tell us about yourself</small>
                </div>
                <div id="gender-form" className="form-group">
                    <p>Please select your gender:</p>
                    <input
                        type="radio"
                        id="male"
                        name="gender"
                        value="Male"
                        onChange={(e)=>onChange(e)}
                    />
                    <label htmlFor="male">Male</label>
                    <input
                        type="radio"
                        id="female"
                        name="gender"
                        value="Female"
                        onChange={(e)=>onChange(e)}
                    />
                    <label htmlFor="female">Female</label>
                    <input
                        type="radio"
                        id="other"
                        name="gender"
                        value="Other"
                        onChange={(e)=>onChange(e)}
                    />
                    <label htmlFor="other">Other</label>
                </div>
                <div className="form-group">
                    <button
                        className="btn btn-secondary"
                        type="button"
                        onClick={()=>toggleLinks(!displayLinks)}>
                        Add social media links
                    </button>
                </div>

                {displayLinks && <Fragment>
                    <div className="form-group">
                        <input
                            type="text"
                            className="form-control"
                            name="instagram"
                            id="instagram"
                            placeholder="Instagram"
                            autoComplete="off"
                            value={instagram}
                            onChange={(e)=>onChange(e)}
                        />
                    </div>
                    <div className="form-group">
                        <input
                            className="form-control"
                            name="facebook"
                            id="facebook"
                            placeholder="Facebook"
                            autoComplete="off"
                            value={facebook}
                            onChange={(e)=>onChange(e)}
                        />
                    </div>
                    <div className="form-group">
                        <input
                            className="form-control"
                            name="vk"
                            id="vk"
                            placeholder="Vkontakte"
                            autoComplete="off"
                            value={vk}
                            onChange={(e)=>onChange(e)}
                        />
                    </div>
                    <div className="form-group">
                        <input
                            className="form-control"
                            name="website"
                            id="website"
                            placeholder="Website"
                            autoComplete="off"
                            value={website}
                            onChange={(e)=>onChange(e)}
                        />
                    </div>
                    <div className="form-group">
                        <input
                            className="form-control"
                            name="pinterest"
                            id="pinterest"
                            placeholder="Pinterest"
                            autoComplete="off"
                            value={pinterest}
                            onChange={(e)=>onChange(e)}
                        />
                    </div>
                </Fragment>}

                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </Fragment>
    )
}


Create.propTypes = {
    createProfile: PropTypes.func.isRequired,
    uploadImage: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    profile: state.profile
})

export default connect(mapStateToProps,{createProfile})(Create);