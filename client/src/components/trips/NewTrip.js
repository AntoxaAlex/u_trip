import React, {useState, Fragment} from 'react';
import {connect} from "react-redux";
import {createTrip} from "../../actions/trips";
import axios from "axios";

const NewTrip = ({createTrip}) => {

    const[formData, setFormData]= useState({
        title: "",
        starting_point: "",
        final_destination: "",
        from: "",
        to: "",
        trip_description: ""
    })

    const[tripImageForm, setTripImage] =useState({
        tripImage: ""
    })

    const[campContent, setCamp] =useState([])

    const addCamp = () =>{
        setCamp([...campContent, {
                campTitle: "",
                campImage: "",
                campDescription: ""
            }])
    }

    const removeCamp = index =>{
        const campList = [...campContent];
        campList.splice(index,1);
        setCamp(campList)
    }

    const {
        title,
        starting_point,
        final_destination,
        from,
        to,
        trip_description
    } = formData;

    const {
        tripImage
    } = tripImageForm



    const uploadImages = async (file,index, name) =>{
        const campImageForm = new FormData()
        campImageForm.append("campImage", file)
        console.log("campImageForm" + campImageForm)
        try {
            const campImageUrl =await axios.post("/trips/campImage", campImageForm)
            const campList = [...campContent];
            campList[index][name] = campImageUrl.data
            setCamp(campList);
        }catch (e) {
            console.log(e)
        }
    }


    const onChange = e => setFormData({...formData, [e.target.name]: e.target.value});
    const onChangeTripImage = (e) => setTripImage({...tripImageForm,[e.target.name]: [e.target.files[0]]})
    const onChangeCamp = (e,index) => {
        const {name, value} = e.target;
        const campList = [...campContent];
        campList[index][name] = value;
        setCamp(campList);
    }
    const onChangeCampImage = (e, index) =>{
        const {name, files} = e.target;
        uploadImages(files[0], index, name)
    }


    const onSubmit = e => {
        const imageForm = new FormData()
        imageForm.append('tripImage', tripImage[0])

        e.preventDefault();
        createTrip(
            imageForm,
            title,
            starting_point,
            campContent,
            final_destination,
            from,
            to,
            trip_description)
    }

    return (
        <div>
            <h2>Create New Trip</h2>
            <form onSubmit={e=>onSubmit(e)} encType="multipart/form-data">
                <div className="col-4 upload-image">
                    <div className="form-group">
                        <label htmlFor="tripImage" className="label">
                            <i className="far fa-file-image"></i>
                            <span className="title">Add image</span>
                            <input
                                type="file"
                                name="tripImage"
                                id="tripImage"
                                accept="image/*"
                                onChange={(e)=> onChangeTripImage(e)}
                            />
                        </label>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        className="form-control"
                        name="title"
                        id="title"
                        autoComplete="off"
                        autoFocus
                        value={title}
                        onChange={(e)=>onChange(e)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="startingPoint">Starting point</label>
                    <input
                        type="text"
                        className="form-control"
                        name="starting_point"
                        id="startingPoint"
                        autoComplete="off"
                        value={starting_point}
                        onChange={(e)=>onChange(e)}
                    />
                </div>
                <div className="form-group">
                    <button
                        className="btn btn-secondary"
                        type="button"
                        onClick={()=>addCamp()}>
                        Add camp
                    </button>
                </div>
                <div className="campBox">
                    {campContent.map((el, i)=>{
                        return(
                            <Fragment key={i}>
                                <div className="campGroup">
                                    <div className="row">
                                        <div className="col-4 upload-image">
                                            <div className="form-group">
                                                <label htmlFor={"campImage"+i} className="label">
                                                    <i className="far fa-file-image"></i>
                                                    <span className="title">Add image</span>
                                                    <input
                                                        type="file"
                                                        name="campImage"
                                                        id={"campImage" + i}
                                                        accept="image/*"
                                                        onChange={(e)=> onChangeCampImage(e,i)}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-8">
                                            <div className="form-group">
                                                <label htmlFor={"campTitle" + i}>Title</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="campTitle"
                                                    id={"campTitle" + i}
                                                    autoComplete="off"
                                                    value={campContent[i].campTitle}
                                                    onChange={(e)=>onChangeCamp(e,i)}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor={"campDescription" + i}>Description</label>
                                                <textarea
                                                    className="form-control"
                                                    name="campDescription"
                                                    id={"campDescription" + i}
                                                    autoComplete="off"
                                                    value={campContent[i].campDescription}
                                                    onChange={(e)=>onChangeCamp(e,i)}
                                                />
                                            </div>
                                            <button onClick={()=>removeCamp(i)}>
                                                <i className="far fa-trash-alt"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <hr/>
                            </Fragment>
                        )
                    })}
                </div>
                <div className="form-group">
                    <label htmlFor="finalDestination">Final destination</label>
                    <input
                        type="text"
                        className="form-control"
                        name="final_destination"
                        id="finalDestination"
                        autoComplete="off"
                        value={final_destination}
                        onChange={(e)=>onChange(e)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="from">From</label>
                    <input
                        type="date"
                        className="form-control"
                        name="from"
                        id="from"
                        value={from}
                        onChange={(e)=>onChange(e)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="to">To</label>
                    <input
                        type="date"
                        className="form-control"
                        name="to"
                        id="to"
                        value={to}
                        onChange={(e)=>onChange(e)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        className="form-control"
                        name="trip_description"
                        id="description"
                        value={trip_description}
                        onChange={(e)=>onChange(e)}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
}

export default connect(null, {createTrip})(NewTrip);