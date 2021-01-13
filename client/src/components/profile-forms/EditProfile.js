import React, {useState, Fragment, useEffect} from "react";
import {connect} from "react-redux";
import Spinner from "../layout/Spinner";
import {getCurrentProfile, createProfile, deleteUser} from "../../actions/profile";
import {logout} from "../../actions/auth";
import {Redirect} from "react-router";
import ReactCrop from "react-image-crop";
import PropTypes from "prop-types";
import {Dropdown, DropdownButton} from "react-bootstrap";

const EditProfile = ({getCurrentProfile, createProfile, deleteUser,logout, profile:{profile, loading, isUpdated},auth}) => {

    const[formData, setFormData]= useState({
        dob: "",
        place: "",
        job: "",
        tripdays: "",
        gender: "",
        bio: "",
        instagram: "",
        facebook: "",
        vk: "",
        pinterest: "",
        website: ""
    })

    const[preferenceForm, setPreferenceForm] =useState({
        region:[
            {
                pr_id: "mountains",
                val: "Mountains",
                iconClass: "fas fa-mountain"
            },
            {
                pr_id: "savannah",
                val: "Savannah",
                iconClass: "fas fa-hippo"
            },
            {
                pr_id: "forest",
                val: "Forest",
                iconClass: "fas fa-tree"
            },
            {
                pr_id: "jungle",
                val: "Jungle",
                iconClass: "fas fa-frog"
            },
            {
                pr_id: "water",
                val: "Seas/Oceans",
                iconClass: "fas fa-water"
            },
            {
                pr_id: "arctiс",
                val: "Arctiс",
                iconClass: "far fa-snowflake"
            },
            {
                pr_id: "islands",
                val: "Islands",
                iconClass: "fas fa-umbrella-beach"
            },
            {
                pr_id: "cities",
                val: "Cities",
                iconClass: "fas fa-city"
            }
        ],
        camping:[
            {
                pr_id: "hiking",
                val: "Hiking",
                iconClass: "fas fa-hiking"
            },
            {
                pr_id: "sleep_under_the_stars",
                val: "Sleep under the stars",
                iconClass: "fas fa-campground"
            },
            {
                pr_id: "cook_at_the_stake",
                val: "Cook at the stake",
                iconClass: "fab fa-free-code-camp"
            },
            {
                pr_id: "pick_berries_and_mushrooms",
                val: "Pick berries and mushrooms",
                iconClass: "fab fa-raspberry-pi"
            },
            {
                pr_id: "fishing",
                val: "Fishing",
                iconClass: "fas fa-fish"
            },
            {
                pr_id: "hunting",
                val: "Hunting",
                iconClass: "fas fa-paw"
            },
            {
                pr_id: "rafting",
                val: "Rafting",
                iconClass: "fas fa-ship"
            },
            {
                pr_id: "explore_nature",
                val: "Explore nature",
                iconClass: "fas fa-map"
            }
        ],
        sport:[
            {
                pr_id: "snowboarding",
                val: "Snowboarding",
                iconClass: "fas fa-snowboarding"
            },
            {
                pr_id: "skiing",
                val: "Skiing",
                iconClass: "fas fa-skiing"
            },
            {
                pr_id: "mountain_biking",
                val: "Mountain biking",
                iconClass: "fas fa-biking"
            },
            {
                pr_id: "surfing",
                val: "Surfing",
                iconClass: "fab fa-servicestack"
            },
            {
                pr_id: "parachute_sport",
                val: "Parachute sport",
                iconClass: "fas fa-parachute-box"
            }
        ],
        art:[
            {
                pr_id: "music",
                val: "Music",
                iconClass: "fas fa-guitar"
            },
            {
                pr_id: "photography",
                val: "Photography",
                iconClass: "fas fa-camera-retro"
            },
            {
                pr_id: "singing",
                val: "Singing",
                iconClass: "fas fa-microphone-alt"
            },
            {
                pr_id: "painting",
                val: "Painting",
                iconClass: "fas fa-palette"
            },
            {
                pr_id: "poems",
                val: "Poems",
                iconClass: "fas fa-book-reader"
            }
        ],

        cities:[
            {
                pr_id: "see_the_sights",
                val: "See the sights",
                iconClass: "fab fa-fort-awesome"
            },
            {
                pr_id: "shopping",
                val: "Shopping",
                iconClass: "fab fa-shopify"
            },
            {
                pr_id: "cafes_and_restaurants",
                val: "Cafes and restaurants",
                iconClass: "fas fa-mug-hot"
            }
        ]
    })
    const[preferences, setPreferences] =useState([])

    const [crop, setCrop] = useState({
        unit: "%",
        width: 30,
        aspect: 1
    });

    const[avatarFile, setAvatar] = useState({
        avatar: ""
    })

    const[displayLinks, toggleLinks] = useState(false)

    useEffect(()=>{
        getCurrentProfile()
        setFormData({
            dob: loading || !profile.dob ? "" : profile.dob,
            place: loading || !profile.place ? "" : profile.place,
            job: loading || !profile.job ? "" : profile.job,
            tripdays: loading || !profile.tripdays ? "" : profile.tripdays,
            gender: loading || !profile.gender ? "" : profile.gender,
            bio: loading || !profile.bio ? "" : profile.bio,
            instagram: loading || !profile.instagram ? "" : profile.instagram,
            facebook: loading || !profile.facebook ? "" : profile.facebook,
            vk: loading || !profile.vk ? "" : profile.vk,
            pinterest: loading || !profile.pinterest ? "" : profile.pinterest,
            website: loading || !profile.website ? "" : profile.website
        })
        setAvatar({
            avatar: loading || !profile.imageUrl ? "" : profile.imageUrl
        })
    },[loading])

    const {
        dob,
        place,
        job,
        tripdays,
        gender,
        bio,
        instagram,
        facebook,
        vk,
        pinterest,
        website
    } = formData;

    const {avatar} = avatarFile



    const onChange = e => setFormData({...formData, [e.target.name]: e.target.value});
    const onChangePreferences = (e,id, iconClass) => {
        if(e.target.checked){
            setPreferences([...preferences,{value:e.target.value, iconClass: iconClass}])
        }else{
            const preferenceList = [...preferences];
            const index = preferenceList.findIndex(el=>{
                while (el.iconClass !== iconClass){
                    return false
                }
                return true
            })
            preferenceList.splice(index,1)
            setPreferences(preferenceList)
        }
    }

    const onChangeProfileImage = async (e) =>{
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () =>
                setAvatar({...avatarFile, avatarSrc: reader.result })
            );
            reader.readAsDataURL(e.target.files[0]);
        }

    }

    const onImageLoaded = image => {
        setAvatar({...avatarFile, imageRef: image})
    };

    const onCropComplete = crop => {
        console.log(crop)
        makeClientCrop(crop);
    };

    const makeClientCrop = async (crop) => {
        if (avatarFile.imageRef && crop.width && crop.height) {
            getCroppedImg(
                avatarFile.imageRef,
                crop
            );

        }
    }


    const getCroppedImg = (image, crop) =>{
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
                dataURLtoFile(reader.result, 'avatar.jpg')
            }
        })
    }

    const dataURLtoFile = (dataUrl, fileName) =>{
        let arr = dataUrl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);

        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        let croppedImage = new File([u8arr], fileName, {type:mime});
        setAvatar({...avatarFile, avatar: croppedImage })
    }

    const onSubmit = e => {
        e.preventDefault();
        const imageForm = new FormData()
        imageForm.append('avatar', avatar)
        createProfile(
            typeof avatar === "string" ? avatar : imageForm,
            dob,
            place,
            job,
            preferences,
            gender,
            bio,
            instagram,
            facebook,
            vk,
            pinterest,
            website
        )
    }
    if(isUpdated){
        return <Redirect to="/n/dashboard"/>
    }
    return(
        <Fragment>
            {profile === null && loading && auth.loading ? <Spinner/> : (
                <Fragment>
                    {profile !== null && auth.user!==null ? (<Fragment>
                        <form encType="multipart/form-data" className="p-3" noValidate onSubmit={e=>onSubmit(e)}>
                            <h2 className="text-center my-5">Edit Profile</h2>
                            <div className="profileCreate row">
                                <div className="upload-image col-12 col-md-4 col-lg-2 order-0">
                                    <div className="form-group">
                                        <label htmlFor="image" className="label rounded-circle" style={{width: "200px", height: "200px", backgroundImage: "url("+avatar+")", backgroundSize: "cover", backgroundPosition: "center"}}>
                                            <i className="far fa-file-image"/>
                                            <span className="title">Add avatar</span>
                                            <input
                                                type="file"
                                                id="image"
                                                name="avatar"
                                                accept="image/*"
                                                onChange={(e)=>onChangeProfileImage(e)}
                                                required
                                            />
                                        </label>
                                    </div>
                                    <div id="croper" className="col-9" style={{display: "inline"}}>
                                        {avatarFile.avatarSrc ?(<Fragment>
                                            <ReactCrop
                                                className="float-left mb-5"
                                                src={avatarFile.avatarSrc}
                                                crop={crop}
                                                ruleOfThirds
                                                onImageLoaded={(image)=>onImageLoaded(image)}
                                                onChange={newCrop => setCrop(newCrop)}
                                                onComplete={(crop)=>onCropComplete(crop)}
                                            />
                                        </Fragment>):null }
                                    </div>
                                </div>
                                <div className="mainInfoProfile col-12 col-md-8 col-lg-10 order-1">
                                    <div className="row">
                                        <p className="col-sm-3"><i className="fas fa-user-check"/>  First Name</p>
                                        <p className="col-sm-9">{auth.user.firstname}</p>
                                    </div>
                                    <div className="form-group row">
                                        <p className="col-sm-3"><i className="fas fa-user-check"/>  Last Name</p>
                                        <p className="col-sm-9">{auth.user.secondname}</p>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="dob" className="col-sm-3 col-form-label"><i
                                            className="fas fa-calendar-day"/>  Date of birth</label>
                                        <input
                                            type="date"
                                            className="form-control col-sm-9"
                                            name="dob"
                                            id="dob"
                                            autoComplete="off"
                                            value={dob}
                                            onChange={(e)=>onChange(e)}
                                        />
                                    </div>
                                    <div className="gender-form form-group row">
                                        <p className="col-sm-3 col-form-label"><i className="fas fa-venus-mars"/> Gender</p>
                                        <div className="col-sm-9">
                                            <input
                                                type="radio"
                                                id="male"
                                                name="gender"
                                                value="Male"
                                                onChange={(e)=>onChange(e)}
                                            />
                                            <label htmlFor="male"><i className="fas fa-male"/></label>
                                            <input
                                                type="radio"
                                                id="female"
                                                name="gender"
                                                value="Female"
                                                onChange={(e)=>onChange(e)}
                                            />
                                            <label htmlFor="female"><i className="fas fa-female"/></label>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="place" className="col-sm-3 col-form-label"><i
                                            className="fas fa-street-view"/>  City</label>
                                        <input
                                            type="text"
                                            className="form-control col-sm-9"
                                            name="place"
                                            id="place"
                                            autoComplete="off"
                                            value={place}
                                            onChange={(e)=>onChange(e)}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="job" className="col-sm-3 col-form-label"><i className="fas fa-user-tie"/>  Job</label>
                                        <input
                                            type="text"
                                            className="form-control col-sm-9"
                                            name="job"
                                            id="job"
                                            autoComplete="off"
                                            value={job}
                                            onChange={(e)=>onChange(e)}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="website" className="col-sm-3 col-form-label"><i className="fas fa-desktop"/>  Website</label>
                                        <input
                                            className="form-control  col-sm-9"
                                            name="website"
                                            id="website"
                                            autoComplete="off"
                                            value={website}
                                            onChange={(e)=>onChange(e)}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="tripdays" className="col-sm-3 col-form-label"><i
                                            className="far fa-clock"/>  Days in trip</label>
                                        <input
                                            type="text"
                                            className="form-control col-sm-9"
                                            name="tripdays"
                                            id="tripdays"
                                            autoComplete="off"
                                            value={tripdays}
                                            onChange={(e)=>onChange(e)}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="bio" className="col-sm-3 col-form-label"><i
                                            className="fas fa-file-signature"/>  About you</label>
                                        <div className="col-sm-9">
                                         <textarea
                                             className="form-control col-sm-9"
                                             name="bio"
                                             id="bio"
                                             autoComplete="off"
                                             value={bio}
                                             onChange={(e)=>onChange(e)}
                                         />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <p className="col-sm-3"><i className="fas fa-skiing"/>  Preferences</p>
                                        <DropdownButton className="col-sm-9" variant="light" id="dropdown-checkbox" size="sm"  title="Choose your preferences">
                                            <div className="checkbox_div">
                                                <h5>Region</h5>
                                                {preferenceForm.region.map((region, i)=>{
                                                    return(
                                                        <div key={i} className="preferencesType">
                                                            <input type="checkbox" id={region.pr_id}  value={region.val} onChange={(e)=>onChangePreferences(e,region.pr_id, region.iconClass)}/>
                                                            <label htmlFor={region.pr_id}><i className={region.iconClass}/>  {region.val}</label>
                                                        </div>
                                                    )
                                                })}
                                                <Dropdown.Divider />
                                                <br/>
                                                <h5>Camping</h5>
                                                {preferenceForm.camping.map((camping, i)=>{
                                                    return(
                                                        <div key={i} className="preferencesType">
                                                            <input type="checkbox" id={camping.pr_id}  value={camping.val} onChange={(e)=>onChangePreferences(e,camping.pr_id, camping.iconClass)}/>
                                                            <label htmlFor={camping.pr_id}><i className={camping.iconClass}/>  {camping.val}</label>
                                                        </div>
                                                    )
                                                })}
                                                <Dropdown.Divider />
                                                <br/>
                                                <h5>Sport</h5>
                                                {preferenceForm.sport.map((sport, i)=>{
                                                    return(
                                                        <div key={i} className="preferencesType">
                                                            <input type="checkbox" id={sport.pr_id}  value={sport.val} onChange={(e)=>onChangePreferences(e,sport.pr_id, sport.iconClass)}/>
                                                            <label htmlFor={sport.pr_id}><i className={sport.iconClass}/>  {sport.val}</label>
                                                        </div>
                                                    )
                                                })}
                                                <Dropdown.Divider />
                                                <br/>
                                                <h5>Art</h5>
                                                {preferenceForm.art.map((art, i)=>{
                                                    return(
                                                        <div key={i} className="preferencesType">
                                                            <input type="checkbox" id={art.pr_id}  value={art.val} onChange={(e)=>onChangePreferences(e,art.pr_id, art.iconClass)}/>
                                                            <label htmlFor={art.pr_id}><i className={art.iconClass}/>  {art.val}</label>
                                                        </div>
                                                    )
                                                })}
                                                <Dropdown.Divider />
                                                <br/>
                                                <h5>City</h5>
                                                {preferenceForm.cities.map((cities, i)=>{
                                                    return(
                                                        <div key={i} className="preferencesType">
                                                            <input type="checkbox" id={cities.pr_id}  value={cities.val} onChange={(e)=>onChangePreferences(e,cities.pr_id, cities.iconClass)}/>
                                                            <label htmlFor={cities.pr_id}><i className={cities.iconClass}/>  {cities.val}</label>
                                                        </div>
                                                    )
                                                })}
                                                <Dropdown.Divider />
                                                <br/>
                                            </div>
                                        </DropdownButton>
                                    </div>
                                    <div className="form-group">
                                        <button
                                            className="btn btn-outline-primary btn-sm"
                                            type="button"
                                            onClick={()=>toggleLinks(!displayLinks)}>
                                            Add social media links
                                        </button>
                                    </div>

                                    {displayLinks && <Fragment>
                                        <div className="form-group row">
                                            <label htmlFor="instagram" className="col-sm-3 col-form-label"><i className="fab fa-instagram"/>  Instagram</label>
                                            <input
                                                type="text"
                                                className="form-control  col-sm-9"
                                                name="instagram"
                                                id="instagram"
                                                autoComplete="off"
                                                value={instagram}
                                                onChange={(e)=>onChange(e)}
                                            />
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="facebook" className="col-sm-3 col-form-label"><i className="fab fa-facebook-f"/>  Facebook</label>
                                            <input
                                                className="form-control  col-sm-9"
                                                name="facebook"
                                                id="facebook"
                                                autoComplete="off"
                                                value={facebook}
                                                onChange={(e)=>onChange(e)}
                                            />
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="vk" className="col-sm-3 col-form-label"><i className="fab fa-vk"/>  Vk</label>
                                            <input
                                                className="form-control  col-sm-9"
                                                name="vk"
                                                id="vk"
                                                autoComplete="off"
                                                value={vk}
                                                onChange={(e)=>onChange(e)}
                                            />
                                        </div>
                                        <div className="form-group row"><label htmlFor="pinterest" className="col-sm-3 col-form-label"><i className="fab fa-pinterest-p"/>  Pinterest</label>
                                            <input
                                                className="form-control col-sm-9"
                                                name="pinterest"
                                                id="pinterest"
                                                autoComplete="off"
                                                value={pinterest}
                                                onChange={(e)=>onChange(e)}
                                            />
                                        </div>
                                    </Fragment>}

                                </div>
                            </div>
                            <div className="text-center mt-5">
                                <button type="submit" className="btn btn-primary">Submit</button>
                                <button
                                    type="button"
                                    className="btn btn-outline-danger"
                                    onClick={()=> {
                                        deleteUser()
                                        logout()
                                    }}
                                >Delete user</button>
                            </div>
                        </form>
                    </Fragment>):null
                    }
                </Fragment>)}
        </Fragment>
    )
}

EditProfile.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    createProfile: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    deleteUser: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
}

const mapStateToProps = state =>({
    profile: state.profile,
    auth: state.auth
})

export default connect(mapStateToProps,{getCurrentProfile, createProfile, deleteUser,logout})(EditProfile)

