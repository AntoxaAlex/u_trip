import React, {Fragment, useEffect, useState} from 'react';
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {getTripById, createComment, createReply, setRating, removeCommentReply, reachPoint,editComment} from "../../actions/trips";
import {useParams} from "react-router";
import TripMap from "../map/TripMap";
import {addLike} from "../../actions/trips";
import Spinner from "../layout/Spinner";
import {Link} from "react-router-dom";
import ReactStars from "react-rating-stars-component";

const ShowTrip = ({getTripById, createComment, createReply, addLike, setRating, removeCommentReply, reachPoint, editComment, trips:{trip, loading}, profile:{myProfile}, profileLoading, auth:{user}, userLoading}) => {

    const {id} = useParams()

    const[style, setStyle] = useState({
        bg: "",
        image: ""
    })

    const[isCommentSelected, setSelectedComment] = useState({
        id: "",
        val: ""
    })
    const[commentForm, editCommentForm] = useState({
        text: ""
    })


    useEffect(()=>{
        getTripById(id)
        if(trip){
            setStyle({
                bg: trip.type === "Mountains" ? "linear-gradient(to right,rgba(15,32,39,0.5),rgba(32,58,67,0.5), rgba(44,83,100,0.5))" : (
                    trip.type === "Savannah" ? "linear-gradient(to right,rgba(253, 200, 48, 0.5),rgba(243, 115, 53, 0.5))": (
                        trip.type === "Forest" ? "linear-gradient(to right,rgba(198, 255, 221, 0.5),rgba(251, 215, 134, 0.5),rgba(247, 121, 125, 0.5))" : (
                            trip.type === "Jungle" ? "linear-gradient(to right,rgba(220, 227, 91, 0.5),rgba(69, 182, 73, 0.5))" : (
                                trip.type === "Seas/Oceans" ? "linear-gradient(to right,rgba(178, 254, 250, 0.5),rgba(14, 210, 247, 0.5))" : (
                                    trip.type === "Arctiс" ? "linear-gradient(to right,rgba(172, 182, 229, 0.5),rgba(134, 253, 232, 0.5))" : (
                                        trip.type === "Islands" ? "linear-gradient(to right,rgba(34, 193, 195, 0.5),rgba(253, 187, 45, 0.5))" : (
                                            "linear-gradient(to right,rgba(171, 186, 171, 0.5),rgba(255, 255, 255, 0.5))"
                                        )
                                    )
                                )
                            )
                        )
                    )
                ),
                image: trip.type === "Mountains" ? "url('http://res.cloudinary.com/antoxaalex/image/upload/v1607563367/backgrounds/mountains-5689938_hznpjr.png')" : (
                    trip.type === "Savannah" ? "url('https://res.cloudinary.com/antoxaalex/image/upload/v1607614457/backgrounds/africa-2023232_uygylf.png')" : (
                        trip.type === "Forest" ? "url('https://res.cloudinary.com/antoxaalex/image/upload/v1607614301/backgrounds/forest-1597029_rmsqzd.png')" : (
                            trip.type === "Jungle" ? "url('https://res.cloudinary.com/antoxaalex/image/upload/v1607614586/backgrounds/snake-576739_kvchwj.png')" : (
                                trip.type === "Seas/Oceans" ? "url('https://res.cloudinary.com/antoxaalex/image/upload/v1607614787/backgrounds/ocean-1221243_qzsifu.png')" : (
                                    trip.type === "Arctiс" ? "url('https://res.cloudinary.com/antoxaalex/image/upload/v1607614875/backgrounds/antarctic-161969_uyvc4m.png')" : (
                                        trip.type === "Islands" ? "url('https://res.cloudinary.com/antoxaalex/image/upload/v1607615780/backgrounds/beach-2245049_nva9og.png')" : (
                                            "url('https://res.cloudinary.com/antoxaalex/image/upload/v1607615909/backgrounds/cityscape-303406_qecosj.png')"
                                        )
                                    )
                                )
                            )
                        )
                    )
                )
            })
        }
        console.log("1")
    },[userLoading, loading])

    const [displayInfo, setInfo] =useState({
        st_point_card: false,
        fn_destination_card: false,
        camp_cards: false
    })

    const [campInfo, setCampInfo] =useState({
        image: "",
        title: "",
        description: "",
        latitude: "",
        longitude: ""
    })

    const [centerMap, setCenter] = useState({
        isClicked: false,
        latitude:"",
        longitude: ""
    })

    const [comment, setComment]=useState({
        comment_text: "",
        reply_text: ""
    })

    const [reply, setReply] = useState({
        index: null,
        isActive: false
    })

    const showCamp = (id,index) =>{
        if(document.getElementById("camp_information").classList.contains("showInfoClass")){
            document.getElementById("camp_information").classList.remove("showInfoClass")
            document.getElementById("camp_information").classList.add("showPhotoClass")
        }
        if(id === "st_point" && displayInfo){
            setInfo({...displayInfo, st_point_card: true, fn_destination_card: false, camp_cards: false})
            setCenter({...centerMap,
                isClicked: true,
                latitude: trip.st_point.sp_latitude,
                longitude: trip.st_point.sp_longitude
            })

        }else if(id === "fn_destination" && displayInfo){
            setInfo({...displayInfo, fn_destination_card: true, st_point_card: false, camp_cards: false})
            setCenter({...centerMap,
                isClicked: true,
                latitude: trip.fn_destination.fd_latitude,
                longitude: trip.fn_destination.fd_longitude
            })
        }else{
            setInfo({...displayInfo, camp_cards: true, st_point_card: false, fn_destination_card: false})
            setCampInfo({ ...campInfo,
                image: trip.campContent[index].campImage,
                title: trip.campContent[index].campTitle,
                description: trip.campContent[index].campDescription,
                latitude: trip.campContent[index].campLatitude,
                longitude: trip.campContent[index].campLongitude
            })
            setCenter({...centerMap,
                isClicked: true,
                latitude: trip.campContent[index].campLatitude,
                longitude: trip.campContent[index].campLongitude
            })
        }
    }

    const rotateDiv = () =>{
        const div = document.getElementById("camp_information")
            if(div.classList.contains("showInfoClass")){
                div.classList.remove("showInfoClass")
                div.classList.add("showPhotoClass")
            } else if(!div.classList.contains("showInfoClass")) {
                div.classList.remove("showPhotoClass")
                div.classList.add("showInfoClass")
            }

    }

    const{
        comment_text,
        reply_text
    } = comment

    const ratingChanged = (newRating) =>{
        setRating(newRating,id)
    }

    return (
        <Fragment>
            {!trip && loading  && !myProfile && profileLoading  && !style.bg && !style.image  && style.bg === "" && style.image === "" ? (
                <Spinner/>
            ): (<Fragment>
                    {trip && !loading && user && myProfile && style.bg !== "" && style.image !== ""  ? (<Fragment>
                        <div className="trip_container" style={{background: style.bg}}>
                            <div id="showTripHeader" className="container-fluid mb-4" style={{backgroundImage: style.image}}>
                                <div id="trip_title_div" className="container">
                                    <h1 className="">{trip.title}</h1>
                                    <p>
                                        <Link className="nav-link" to={"/n/trips/edit/"+id}>
                                            <i className="fas fa-cog"/>
                                        </Link>
                                    </p>
                                </div>
                                <div id="ratingRow">
                                    <div>
                                        <ReactStars
                                            className="my-5"
                                            value={trip.generalRating ? trip.generalRating : null}
                                            count={5}
                                            size={40}
                                            edit={(trip.ratings.filter(rating=>rating.user === myProfile.user._id).length>0) ? false : true}
                                            onChange={ratingChanged}
                                            activeColor="#ffd700"
                                            isHalf={true}
                                            emptyIcon={<i className="far fa-star"/>}
                                            halfIcon={<i className="fas fa-star-half"/>}
                                            fullIcon={<i className="fas fa-star"/>}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div id="showTripContent" className="px-3">
                                <div id="desc_rate_row" className="mb-3">
                                    <div id="showTripTeamDiv" style={{gridTemplateColumns: `repeat(${trip.team.length}, calc(20%))`}}>
                                        {trip.team.map((teammate, i)=>{
                                            return(
                                                <div key={i} className="friendItem">
                                                    <Link
                                                        to={"/n/dashboard/"+teammate.user._id}
                                                        className="btn nav-link p-0"
                                                    >
                                                        <img alt="" className="rounded-circle" style={{width: "70px", height: "70px"}} src={teammate.imageUrl}/>
                                                    </Link>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <div id="trip_description_div" className="col-12 col-md-6 order-0 mb-3">
                                        <h3 className="mb-3">Description</h3>
                                        <p>{trip.trip_description}</p>
                                    </div>
                                </div>

                                <div id="mapCampRow" className="row mb-5 bg-transparent">
                                    <div id="tripMapDiv" className="mb-3 col-12 col-lg-6 order-0">
                                        <img
                                            alt=""
                                            src="https://res.cloudinary.com/antoxaalex/image/upload/v1607177511/backgrounds/pushpin-147918_640_y0u3dz.png"
                                            style={{
                                                width: "50px",
                                                height: "50px",
                                                position: "absolute",
                                                top: "0",
                                                left: "0",
                                                zIndex: "1000"
                                            }}
                                        />
                                        <img
                                            alt=""
                                            src="https://res.cloudinary.com/antoxaalex/image/upload/v1607177511/backgrounds/pushpin-147918_640_y0u3dz.png"
                                            style={{
                                                width: "50px",
                                                height: "50px",
                                                position: "absolute",
                                                float: "right",
                                                right: "0",
                                                zIndex: "1000"
                                            }}
                                        />
                                        <TripMap
                                            center={{
                                                lat: !centerMap.isClicked ? parseFloat(trip.st_point.sp_latitude) : parseFloat(centerMap.latitude),
                                                lng: !centerMap.isClicked ? parseFloat(trip.st_point.sp_longitude) : parseFloat(centerMap.longitude)
                                            }}
                                            mapType={"show"}
                                            trip={trip}
                                        />
                                    </div>
                                    <div id="tripCampsDiv" className="col-12 col-lg-5 order-1 ml-lg-2">
                                        <ul>
                                            <img
                                                alt=""
                                                src="https://res.cloudinary.com/antoxaalex/image/upload/v1607177511/backgrounds/pushpin-147918_640_y0u3dz.png"
                                                style={{
                                                    width: "70px",
                                                    height: "70px",
                                                    position: "absolute",
                                                    top: "0",
                                                    right: "50%",
                                                    zIndex: "1000"
                                                }}
                                            />
                                            <li className="row showPointDiv" style={{color: trip.st_point.isSpReached ? "green" : "gray", marginTop: "30px"}}>
                                                <div className="col-2">
                                                    <i className="far fa-flag"/>
                                                </div>
                                                <div className="col-7">
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm bg-transparent"
                                                        style={{color: trip.st_point.isSpReached ? "green" : "gray"}}
                                                        onClick={()=>showCamp("st_point")}
                                                    >{trip.st_point.sp_title}</button>
                                                </div>
                                                {!trip.st_point.isSpReached ? ( <form className="col-2">
                                                    <input
                                                        className="form-control"
                                                        id="sp_check"
                                                        name="sp_check"
                                                        type="checkbox"
                                                        value="reached"
                                                        onChange={(e)=>{
                                                            e.preventDefault();
                                                            const {name} = e.target
                                                            reachPoint(id, name)
                                                        }}
                                                    />
                                                </form>) : (<i className="fas fa-check col-2" style={{color: "green"}}/>)}
                                            </li>
                                            <li className="verticalBorder"/>
                                            {trip.campContent.map((camp, i)=> {

                                                return(
                                                    <Fragment key={i}>
                                                        <li className="row showPointDiv" style={{color: camp.isCampReached ? "green" : "gray"}}>
                                                            <div className="col-2">
                                                                <i className="fas fa-map-pin"/>
                                                            </div>
                                                            <div className="col-7">
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm bg-transparent"
                                                                    style={{color: camp.isCampReached ? "green" : "gray"}}
                                                                    onClick={()=>showCamp("camp_card" + i, i)}
                                                                >{camp.campTitle}</button>
                                                            </div>
                                                            {!camp.isCampReached ? ( <form className="col-2">
                                                                <input
                                                                    className="form-control"
                                                                    id={"camp_check" + i}
                                                                    name={i}
                                                                    type="checkbox"
                                                                    value="reached"
                                                                    onChange={(e)=>{
                                                                        e.preventDefault();
                                                                        const {name} = e.target
                                                                        reachPoint(id, name)
                                                                    }}
                                                                />
                                                            </form>) : (<i className="fas fa-check col-2" style={{color: "green"}}/>)}
                                                        </li>
                                                        <li className="verticalBorder"/>
                                                    </Fragment>
                                                )
                                            })}
                                            <li className="row showPointDiv" style={{color: trip.fn_destination.isFdReached ? "green" : "gray"}}>
                                                <div className="col-2">
                                                    <i className="far fa-flag"/>
                                                </div>
                                                <div className="col-7">
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm bg-transparent"
                                                        style={{color: trip.fn_destination.isFdReached ? "green" : "gray"}}
                                                        onClick={()=>showCamp("fn_destination")}
                                                    >{trip.fn_destination.fd_title}</button>
                                                </div>
                                                {!trip.fn_destination.isFdReached ? (<form className="col-2">
                                                    <input
                                                        className="form-control"
                                                        id="fd_check"
                                                        name="fd_check"
                                                        type="checkbox"
                                                        value="reached"
                                                        onChange={(e)=>{
                                                            e.preventDefault();
                                                            const {name} = e.target
                                                            reachPoint(id, name)
                                                        }}
                                                    />
                                                </form>) : (<i className="fas fa-check col-2" style={{color: "green"}}/>)}
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div id="camp_information" className="mx-auto my-5 showPhotoClass" onClick={()=>rotateDiv()}>
                                    {displayInfo.st_point_card &&  <Fragment>
                                        <div className="card m-auto p-3" style={{width: "18rem", position: "relative", transform: "rotate(10deg)"}}>
                                            {document.getElementById("camp_information").classList.contains("showPhotoClass") &&
                                            document.getElementById("camp_information").getAnimations() ? (<Fragment>
                                                <img
                                                    alt=""
                                                    src="https://res.cloudinary.com/antoxaalex/image/upload/v1607177511/backgrounds/pushpin-147918_640_y0u3dz.png"
                                                    style={{
                                                        width: "50px",
                                                        height: "50px",
                                                        position: "absolute",
                                                        top: "0",
                                                        right: "50%",
                                                        zIndex: "1000"
                                                    }}
                                                />
                                                <img src={trip.st_point.sp_image} className="card-img-top" alt="..."/>
                                                <div className="card-body">
                                                    <h5 className="card-title text-center">{trip.st_point.sp_title}</h5>
                                                </div>
                                            </Fragment>): (<Fragment>
                                                <div className="pointDescription">
                                                    <p>
                                                        {trip.st_point.sp_description}
                                                    </p>
                                                </div>
                                            </Fragment>)}
                                        </div>
                                    </Fragment>}
                                    {displayInfo.fn_destination_card &&  <Fragment>
                                        <div className="card m-auto p-3" style={{width: "18rem", position: "relative", transform: "rotate(10deg)"}}>
                                            {document.getElementById("camp_information").classList.contains("showPhotoClass") &&
                                            document.getElementById("camp_information").getAnimations() ? (<Fragment>
                                                <img
                                                    alt=""
                                                    src="https://res.cloudinary.com/antoxaalex/image/upload/v1607177511/backgrounds/pushpin-147918_640_y0u3dz.png"
                                                    style={{
                                                        width: "50px",
                                                        height: "50px",
                                                        position: "absolute",
                                                        top: "0",
                                                        right: "50%",
                                                        zIndex: "1000"
                                                    }}
                                                />
                                                <img src={trip.fn_destination.fd_image} className="card-img-top" alt="..."/>
                                                <div className="card-body">
                                                    <h5 className="card-title text-center">{trip.fn_destination.fd_title}</h5>
                                                </div>
                                            </Fragment>): (<Fragment>
                                                <div className="pointDescription">
                                                    <p>
                                                        {trip.fn_destination.fd_description}
                                                    </p>
                                                </div>
                                            </Fragment>)}
                                        </div>
                                    </Fragment>}
                                    {displayInfo.camp_cards && <Fragment>
                                        <div className="card m-auto p-3" style={{width: "18rem", position: "relative", transform: "rotate(10deg)"}}>
                                            {document.getElementById("camp_information").classList.contains("showPhotoClass") &&
                                            document.getElementById("camp_information").getAnimations() ? (<Fragment>
                                                <img
                                                    alt=""
                                                    src="https://res.cloudinary.com/antoxaalex/image/upload/v1607177511/backgrounds/pushpin-147918_640_y0u3dz.png"
                                                    style={{
                                                        width: "50px",
                                                        height: "50px",
                                                        position: "absolute",
                                                        top: "0",
                                                        right: "50%",
                                                        zIndex: "1000"
                                                    }}
                                                />
                                                <img src={campInfo.image} className="card-img-top" alt="..."/>
                                                <div className="card-body">
                                                    <h5 className="card-title text-center">{campInfo.title}</h5>
                                                </div>
                                            </Fragment>): (<Fragment>
                                                <div className="pointDescription">
                                                    <p>
                                                        {campInfo.description}
                                                    </p>
                                                </div>
                                            </Fragment>)}
                                        </div>
                                    </Fragment>
                                    }
                                </div>
                                <div id="comments">
                                    {trip.comments.length>0?(
                                        <div id="commentsList">
                                            <h5>{trip.comments.length} Comments</h5>
                                            {trip.comments.map((comment, i)=>{
                                                return(
                                                    <div className="comment_replyDiv" key={i}>
                                                        <hr/>
                                                        <div className="comment row mb-3">
                                                            <div className="col-3 col-sm-2 col-lg-1">
                                                                <img src={comment.profileImage} alt=""
                                                                     style={{width: "70px", height: "70px"}}
                                                                     className="rounded-circle"
                                                                />
                                                            </div>
                                                            <div id="commentText" className="col-7 col-sm-8 col-lg-9" >
                                                                {isCommentSelected.val && isCommentSelected.id === comment._id ? (
                                                                    <form
                                                                    onSubmit={(e)=>{
                                                                        e.preventDefault();
                                                                        editComment(commentForm.text, id, comment._id)
                                                                        setSelectedComment(!isCommentSelected.val)

                                                                    }}>
                                                                        <textarea
                                                                            name="text"
                                                                            autoComplete="off"
                                                                            onChange={(e)=>editCommentForm({...commentForm, [e.target.name]: e.target.value})}
                                                                            value={commentForm.text !== "" ? commentForm.text : ""}
                                                                        />
                                                                    <button
                                                                        type="submit"
                                                                        className="btn btn-success"
                                                                    >Submit</button>
                                                                </form>) : (<Fragment>
                                                                        <div className="m-auto">
                                                                            <p>{comment.text}</p>
                                                                        </div>
                                                                        <span className="text-danger float-right align-self-end">
                                                                    {comment.likes.length} <i className="far fa-heart"/>
                                                                    </span>
                                                                </Fragment>
                                                                )}
                                                            </div>
                                                            <div className="col-2 p-0">
                                                                <div id="commentBtns">
                                                                    <button className="btn btn-success"
                                                                            type="button"
                                                                            onClick={() => {setReply({index: i, isActive: !reply.isActive})}}
                                                                    >
                                                                        <i className="fas fa-pen"/>
                                                                    </button>
                                                                    {comment.user === user._id && <Fragment>
                                                                        <button
                                                                            style={{display: "block"}}
                                                                            type="button"
                                                                            className="btn btn-warning"
                                                                            onClick={()=> {
                                                                                setSelectedComment({id: comment._id, val: !isCommentSelected.val})
                                                                                editCommentForm({text: comment.text})
                                                                            }}
                                                                        ><i className="fas fa-edit"/></button>
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-dark"
                                                                            onClick={()=>removeCommentReply("comment",i, trip._id, comment._id)}
                                                                        ><i className="far fa-trash-alt"/></button>
                                                                    </Fragment>}
                                                                    <button className="btn btn-danger"
                                                                            type="button"
                                                                            onClick={() => addLike(trip._id, comment._id)}
                                                                    ><i className="far fa-heart"/>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {comment.replies.length>0 ? (
                                                            <Fragment>
                                                                {comment.replies.map((reply,i)=>{
                                                                    return(
                                                                        <Fragment key={i}>
                                                                            <div className="row mx-5 mb-3">
                                                                                <div className="col-3 col-sm-2 col-lg-1">
                                                                                    <img src={reply.profileImage} alt=""
                                                                                         style={{width: "50px", height: "50px"}}
                                                                                         className="rounded-circle"/>
                                                                                </div>
                                                                                <div id="commentText" className="col-7 col-sm-8 col-lg-9" >
                                                                                    <div style={{margin: "auto"}}>
                                                                                        <p>{reply.text}</p>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-2 p-0">
                                                                                    {reply.user === user._id && <Fragment>
                                                                                        <div id="commentBtns">
                                                                                            <button
                                                                                                type="button"
                                                                                                className="btn btn-dark"
                                                                                                onClick={()=>removeCommentReply("reply",i, trip._id,comment._id)}
                                                                                            ><i className="far fa-trash-alt"/></button>
                                                                                        </div>
                                                                                    </Fragment>}
                                                                                </div>
                                                                            </div>
                                                                        </Fragment>
                                                                    )
                                                                })}
                                                            </Fragment>
                                                        ):null}
                                                        {reply.index === i && reply.isActive &&
                                                        <Fragment>
                                                            <div className="row mx-5">
                                                                <div className="col-3">
                                                                    <img src={comment.profileImage} alt=""
                                                                         style={{width: "50px", height: "50px"}}
                                                                         className="rounded-circle"/>
                                                                </div>
                                                                <div className="col-9">
                                                                    <form onSubmit={(e)=>{
                                                                        e.preventDefault();
                                                                        createReply(reply_text, id, comment._id ,myProfile.imageUrl, user.firstname + " " + user.secondname)
                                                                        setReply({index: null, isActive: false})
                                                                        setComment({...comment, reply_text: ""})
                                                                    }}>
                                                                        <div className="input-group mb-3 my-4">
                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                autoComplete="off"
                                                                                name="reply_text"
                                                                                placeholder="Write reply"
                                                                                value={reply_text}
                                                                                aria-label="Reply's text"
                                                                                aria-describedby="button-send-reply"
                                                                                onChange={(e)=>{setComment({...comment, [e.target.name]: e.target.value})}}
                                                                            />
                                                                            <div className="input-group-append">
                                                                                <button
                                                                                    id="button-send-reply"
                                                                                    type="submit"
                                                                                    className="btn btn-success"
                                                                                >Reply</button>
                                                                            </div>

                                                                        </div>
                                                                    </form>
                                                                </div>
                                                            </div>
                                                        </Fragment>
                                                        }
                                                    </div>

                                                )
                                            })}
                                            <hr/>
                                        </div>
                                    ):(
                                        <Fragment>
                                            <p className="noDataDiv">No comments</p>
                                            <hr/>
                                        </Fragment>
                                    )}
                                </div>
                                {!profileLoading &&  <div id="commentsCreationForm">
                                    <div className="row">
                                        <div className="col-2 col-lg-1">
                                            <img src={myProfile.imageUrl} alt="" style={{width: "50px", height: "50px"}} className="rounded-circle"/>
                                        </div>
                                        <div className="col-10 col-lg-11">
                                            <form onSubmit={(e)=>{
                                                e.preventDefault();
                                                createComment(comment_text, id, myProfile.imageUrl, user.firstname + " " + user.secondname)
                                                setComment({...comment, comment_text: ""})
                                            }}>
                                                <div className="input-group mb-3">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        autoComplete="off"
                                                        name="comment_text"
                                                        placeholder="Write comment"
                                                        maxLength="160"
                                                        value={comment_text}
                                                        aria-label="Comment's text"
                                                        aria-describedby="button-send-comment"
                                                        onChange={(e)=>{setComment({...comment, [e.target.name]: e.target.value})}}
                                                    />
                                                    <div className="input-group-append">
                                                        <button
                                                            id="button-send-comment"
                                                            type="submit"
                                                            className="btn btn-success"
                                                        >Comment</button>
                                                    </div>

                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                }
                            </div>
                        </div>
                    </Fragment>): null}
                </Fragment>
            )}
        </Fragment>
        )
}

ShowTrip.propTypes = {
    getTripById: PropTypes.func.isRequired,
    createComment: PropTypes.func.isRequired,
    addLike: PropTypes.func.isRequired,
    setRating: PropTypes.func.isRequired,
    reachPoint: PropTypes.func.isRequired,
    editComment: PropTypes.func.isRequired,
    trips: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    profileLoading: PropTypes.bool.isRequired,
    userLoading: PropTypes.bool.isRequired
}

const mapStateToProps = state => ({
    trips: state.trips,
    auth: state.auth,
    profile: state.profile,
    profileLoading: state.profile.loading,
    userLoading: state.auth.loading
})

export default connect(mapStateToProps,{getTripById, createComment, createReply, addLike, setRating, removeCommentReply, reachPoint, editComment})(ShowTrip);