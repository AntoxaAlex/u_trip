import React, {Fragment, useEffect, useState} from 'react';
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {getTripById, createComment, createReply, setRating, removeCommentReply, reachPoint,editComment} from "../../actions/trips";
import {useParams} from "react-router";
import TripMap from "../map/TripMap";
import {addLike} from "../../actions/trips";
import Spinner from "../layout/Spinner";
import {Link} from "react-router-dom";
import moment from "moment";
import ReactStars from "react-rating-stars-component";

const ShowTrip = ({getTripById, createComment, createReply, addLike, setRating, removeCommentReply, reachPoint, editComment, trips:{trip, loading}, profile:{profile}, profileLoading, auth:{user}, userLoading}) => {

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
    },[loading])

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

    const [reply, setReply] = useState(false)
    const [friendsDiv, openFriendsDiv] = useState({
        isOpen: false,
        friend: null
    })

    const showCamp = (id,index) =>{
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

    const{
        comment_text,
        reply_text
    } = comment

    const ratingChanged = (newRating) =>{
        setRating(newRating,id)
    }

    return (
        <Fragment>
            {!trip && loading  && !profile ? (
                <Spinner/>
            ): (<Fragment>
                    {trip && user && profile && style.bg !== "" && style.image !== ""  ?(<Fragment>
                        <div className="trip_container" style={{background: style.bg}}>
                            <div id="showTripHeader" className="container-fluid mb-4" style={{backgroundImage: style.image, backgroundSize: "cover"}}>
                                <div id="trip_title_div" className="container">
                                    <h1 className="">{trip.title}
                                    <Link style={{fontSize: "20px"}} className="nav-link" to={"/n/trips/edit/"+id}>
                                        <i className="fas fa-cog float-right"/>
                                    </Link></h1>
                                </div>
                                <div id="desc_rate_row" className="row">
                                    <div id="trip_description_div" className="col-lg-4 order-lg-0 mb-3">
                                        <p>{trip.trip_description}</p>
                                    </div>
                                    <div className="col-2 col-xl-3 order-lg-1"/>
                                    <div className="col-lg-6 col-xl-5 order-lg-2">
                                        <div id="ratingRow" className="row">
                                            <div className="col-2">
                                                {(trip.ratings.filter(rating=>rating.user === profile.user._id).length>0) ? (
                                                    <h4 style={{fontFamily: "'Gochi Hand', cursive"}} className="float-right mt-4">Rating</h4>
                                                ) : (
                                                    <h4 style={{fontFamily: "'Gochi Hand', cursive"}} className="float-right mt-4">Rate this trip</h4>
                                                )}
                                            </div>
                                            <div className="col-10">
                                                <ReactStars
                                                    className="my-5"
                                                    value={trip.generalRating ? trip.generalRating : null}
                                                    count={5}
                                                    size={40}
                                                    edit={(trip.ratings.filter(rating=>rating.user === profile.user._id).length>0) ? false : true}
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
                                </div>
                            </div>
                            <div id="showTripContent" className="px-5">
                                <div id="friendsRow" className="row bg-transparent">
                                    <div id="showTripTeamDiv" className="col-xs-3 row mr-4">
                                        {trip.team.map((teammate, i)=>{
                                            return(
                                                <div key={i} className="col-4">
                                                    <Link
                                                        to={"/n/dashboard/"+teammate._id}
                                                        className="btn nav-link p-0"
                                                    >
                                                        <img alt="" className="rounded-circle" style={{width: "50px", height: "50px"}} src={teammate.imageUrl}/>
                                                    </Link>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                                <div id="mapCampRow" className="row mb-5 bg-transparent">
                                    <div id="tripMapDiv" className="col-8" >
                                        <img
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
                                    <div  id="tripCampsDiv" className="col-4">
                                        <ul>
                                            <img
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
                                            <li className="row showPointDiv" style={{color: trip.st_point.isSpReached ? "green" : "gray"}}>
                                                <div className="col-1">
                                                    <i className="far fa-flag"/>
                                                </div>
                                                <div className="col-9">
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
                                                </form>) : (<i className="fas fa-check" style={{color: "green"}}/>)}
                                            </li>
                                            <li className="verticalBorder"/>
                                            {trip.campContent.map((camp, i)=> {

                                                return(
                                                    <Fragment key={i}>
                                                        <li className="row showPointDiv" style={{color: camp.isCampReached ? "green" : "gray"}}>
                                                            <div className="col-1">
                                                                <i className="fas fa-map-pin"/>
                                                            </div>
                                                            <div className="col-9">
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
                                                            </form>) : (<i className="fas fa-check" style={{color: "green"}}/>)}
                                                        </li>
                                                        <li className="verticalBorder"/>
                                                    </Fragment>
                                                )
                                            })}
                                            <li className="row showPointDiv" style={{color: trip.fn_destination.isFdReached ? "green" : "gray"}}>
                                                <div className="col-1">
                                                    <i className="far fa-flag"/>
                                                </div>
                                                <div className="col-9">
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
                                                </form>) : (<i className="fas fa-check" style={{color: "green"}}/>)}
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div id="camp_information bg-transparent">
                                    {displayInfo.st_point_card &&  <Fragment>
                                        <div className="row">
                                            <div className="col-6">
                                                <div className="card p-4 m-auto" style={{width: "18rem", position: "relative", transform: "rotate(30deg)"}}>
                                                    <img
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
                                                        <h5 className="card-title">{trip.st_point.sp_title}</h5>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="pointDescription" style={{
                                                    width: "400px",
                                                    height: "400px",
                                                    padding: "60px 80px 30px 40px",
                                                    backgroundImage: "url('https://res.cloudinary.com/antoxaalex/image/upload/v1607197401/backgrounds/post-it-150262_1280_ql6bcj.png')",
                                                    backgroundSize: "cover"
                                                }}>
                                                    {trip.st_point.sp_description}
                                                </div>
                                            </div>
                                        </div>
                                    </Fragment>}
                                    {displayInfo.fn_destination_card &&  <Fragment>
                                        <div className="row">
                                            <div className="col-6">
                                                <div className="card p-4 m-auto" style={{width: "18rem", position: "relative", transform: "rotate(30deg)"}}>
                                                    <img
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
                                                        <h5 className="card-title">{trip.fn_destination.fd_title}</h5>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="pointDescription" style={{
                                                    width: "400px",
                                                    height: "400px",
                                                    padding: "60px 80px 30px 40px",
                                                    backgroundImage: "url('https://res.cloudinary.com/antoxaalex/image/upload/v1607197401/backgrounds/post-it-150262_1280_ql6bcj.png')",
                                                    backgroundSize: "cover"
                                                }}>
                                                    {trip.fn_destination.fd_description}
                                                </div>
                                            </div>
                                        </div>
                                    </Fragment>}
                                    {displayInfo.camp_cards && <Fragment>
                                        <div className="row">
                                            <div className="col-6">
                                                <div className="card p-4 m-auto" style={{width: "18rem", position: "relative", transform: "rotate(30deg)"}}>
                                                    <img
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
                                                        <h5 className="card-title">{campInfo.title}</h5>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="pointDescription" style={{
                                                    width: "400px",
                                                    height: "400px",
                                                    padding: "60px 80px 30px 40px",
                                                    backgroundImage: "url('https://res.cloudinary.com/antoxaalex/image/upload/v1607197401/backgrounds/post-it-150262_1280_ql6bcj.png')",
                                                    backgroundSize: "cover"
                                                }}>
                                                    {campInfo.description}
                                                </div>
                                            </div>
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
                                                        <div className="comment row">
                                                            <div className="col-1">
                                                                <img src={comment.profileImage} alt=""
                                                                     style={{width: "70px", height: "70px"}}
                                                                     className="rounded-circle"
                                                                />
                                                            </div>
                                                            <div id="commentText" className="col-4" >
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
                                                                            value={commentForm.text !== "" ? commentForm.text: ""}
                                                                        />
                                                                    <button
                                                                        type="submit"
                                                                        className="btn btn-success"
                                                                    >Submit</button>
                                                                </form>) : (
                                                                    <div style={{margin: "auto"}}>
                                                                        <p>{comment.text}</p>
                                                                        <span className="float-right text-danger">
                                                                    {comment.likes.length} <i className="far fa-heart"/>
                                                                </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="col-1 p-0">
                                                                <div id="commentBtns">
                                                                    <button className="btn btn-success"
                                                                            type="button"
                                                                            onClick={() => {setReply(!reply)}}
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
                                                                            onClick={(e)=>removeCommentReply("comment",i, trip._id, comment._id)}
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
                                                                            <div className="row mx-5">
                                                                                <div className="col-1">
                                                                                    <img src={reply.profileImage} alt=""
                                                                                         style={{width: "50px", height: "50px"}}
                                                                                         className="rounded-circle"/>
                                                                                </div>
                                                                                <div id="commentText" className="col-4" >
                                                                                    <div style={{margin: "auto"}}>
                                                                                        <p>{reply.text}</p>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-1 p-0">
                                                                                    {reply.user === user._id && <Fragment>
                                                                                        <div id="commentBtns">
                                                                                            <button
                                                                                                type="button"
                                                                                                className="btn btn-dark"
                                                                                                onClick={(e)=>removeCommentReply("reply",i, trip._id,comment._id)}
                                                                                            ><i className="far fa-trash-alt"/></button>
                                                                                        </div>
                                                                                    </Fragment>}
                                                                                </div>
                                                                                {/*<div className="col-11">*/}
                                                                                {/*    <div className="comment_header">*/}
                                                                                {/*        <Link to="">{reply.username}</Link>*/}
                                                                                {/*        <p>{moment(reply.date).fromNow()}</p>*/}
                                                                                {/*    </div>*/}
                                                                                {/*    <p>{reply.text}</p>*/}
                                                                                {/*</div>*/}
                                                                            </div>
                                                                        </Fragment>
                                                                    )
                                                                })}
                                                            </Fragment>
                                                        ):null}
                                                        {reply &&
                                                        <Fragment>
                                                            <div className="row mx-5">
                                                                <div className="col-1">
                                                                    <img src={comment.profileImage} alt=""
                                                                         style={{width: "50px", height: "50px"}}
                                                                         className="rounded-circle"/>
                                                                </div>
                                                                <div className="col-11">
                                                                    <form onSubmit={(e)=>{
                                                                        e.preventDefault();
                                                                        createReply(reply_text, id, comment._id ,profile.imageUrl, user.firstname + " " + user.secondname)
                                                                        setReply(!reply)
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
                                        <div className="col-1">
                                            <img src={profile.imageUrl} alt="" style={{width: "50px", height: "50px"}} className="rounded-circle"/>
                                        </div>
                                        <div className="col-11">
                                            <form onSubmit={(e)=>{
                                                e.preventDefault();
                                                createComment(comment_text, id, profile.imageUrl, user.firstname + " " + user.secondname)
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