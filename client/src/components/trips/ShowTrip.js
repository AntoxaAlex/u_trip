import React, {Fragment, useEffect, useState} from 'react';
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {getTripById, createComment, createReply, setRating, removeCommentReply} from "../../actions/trips";
import {useParams} from "react-router";
import TripMap from "../map/TripMap";
import {addLike} from "../../actions/trips";
import Spinner from "../layout/Spinner";
import {Link} from "react-router-dom";
import moment from "moment";
import auth from "../../reducers/auth";

const ShowTrip = ({getTripById, createComment, createReply, addLike, setRating, removeCommentReply,trips:{trip, loading}, profile:{profile}, profileLoading, auth:{user}, userLoading}) => {

    const {id} = useParams()

    useEffect(()=>{
        getTripById(id)
    },[getTripById])

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


    const showCamp = (id,index) =>{
        if(id === "st_point" && displayInfo){
            setInfo({...displayInfo, st_point_card: true, fn_destination_card: false, camp_cards: false})
            setCenter({...centerMap,
                isClicked: true,
                latitude: trip.sp_latitude,
                longitude: trip.sp_longitude
            })

        }else if(id === "fn_destination" && displayInfo){
            setInfo({...displayInfo, fn_destination_card: true, st_point_card: false, camp_cards: false})
            setCenter({...centerMap,
                isClicked: true,
                latitude: trip.fd_latitude,
                longitude: trip.fd_longitude
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

            console.log(campInfo)
            // const activeCamp = {...displayInfo.camp_cards}
            // activeCamp[index].isDisplayed = true
            // setInfo(activeCamp)
            // console.log(displayCampCard)
        }
    }

    const removeCard = (el)=>{
        if(el==="st_point_card"){
            setInfo({...displayInfo, st_point_card: false})
        } else if(el==="fn_destination_card"){
            setInfo({...displayInfo, fn_destination_card: false})
        } else {
            setInfo({...displayInfo, camp_cards: false})
        }
    }

    const addRating = (e) =>{
        setRating(e.target.value, id)
    }

    const ratingIcons = [1,2,3,4,5];

    const{
        comment_text,
        reply_text
    } = comment

    return (
        <Fragment>
            {trip === null && loading ? (
                <Spinner/>
            ): (<Fragment>
                    {trip !== null && user !== null ?(<Fragment>
                        <div className="trip_container">
                            <div id="trip_title_div" style={{height: "150px", width: "100%", backgroundImage: "url("+trip.tripImage+")", backgroundSize: "cover", backgroundPosition: "center"}}>
                                <h1>{trip.title}</h1>
                            </div>
                            <hr/>
                            <hr/>
                            <div id="desc_rate_row" className="row">
                                <div id="trip_description_div" className="col-6">
                                    <p>{trip.trip_description}</p>
                                </div>
                                <div className="col-6">
                                    <div id="ratingDiv" className="float-right text-warning">
                                        {user === null ? (<Spinner/>):(<Fragment>
                                            {trip.ratings.filter(rating=>rating.user === user._id).length>0 ?(
                                                <Fragment>
                                                        {ratingIcons.map((rating,i)=>{
                                                            return(
                                                                <Fragment key={i}>
                                                                    {rating <= trip.generalRating ? (<Fragment key={i}>
                                                                        <i id={i} className="fas fa-star"></i>
                                                                    </Fragment>):(null)}
                                                                </Fragment>
                                                            )
                                                        })}
                                                        <span>{trip.generalRating}</span>
                                                </Fragment>
                                            ):(<Fragment>
                                                <form>
                                                    <input type="radio" id="fieldStar1" name="rating" value="1" onClick={(e)=>addRating(e)}/><label className="full" htmlFor="fieldStar1"/>
                                                    <input type="radio" id="fieldStar2" name="rating" value="2" onClick={(e)=>addRating(e)}/><label className="full" htmlFor="fieldStar2"/>
                                                    <input type="radio" id="fieldStar3" name="rating" value="3" onClick={(e)=>addRating(e)}/><label className="full" htmlFor="fieldStar3"/>
                                                    <input type="radio" id="fieldStar4" name="rating" value="4" onClick={(e)=>addRating(e)}/><label className="full" htmlFor="fieldStar4"/>
                                                    <input type="radio" id="fieldStar5" name="rating" value="5" onClick={(e)=>addRating(e)}/><label className="full" htmlFor="fieldStar5"/>
                                                </form>
                                            </Fragment>)}
                                        </Fragment>)}
                                    </div>
                                </div>
                            </div>
                            <hr/>
                            <div id="mapCampRow" className="row">
                                <div id="tripMapDiv" className="col-8">
                                    {!centerMap.isClicked ? (
                                        <TripMap center={{
                                            lat: parseFloat(trip.sp_latitude),
                                            lng: parseFloat(trip.sp_longitude)
                                        }}/>
                                    ):(
                                        <TripMap center={{
                                            lat: parseFloat(centerMap.latitude),
                                            lng: parseFloat(centerMap.longitude)
                                        }}/>
                                    )}
                                </div>
                                <div id="tripCampsDiv" className="col-4">
                                    <div id="spCard" className="card border-success mb-3">
                                        <div className="row no-gutters">
                                            <div className="col-md-5">
                                                <img src={trip.sp_image} className="card-img" alt="..."/>
                                            </div>
                                            <div className="col-md-7">
                                                <div className="card-body">
                                                    <h5 className="card-title">{trip.sp_title}</h5>
                                                    <p className="card-text">{trip.from}</p>
                                                    <button className="btn btn-secondary btn-sm"
                                                            type="button"
                                                            onClick={()=>showCamp("st_point")}
                                                    > More info</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {trip.campContent.map((camp, i)=> {

                                        return(
                                            <Fragment key={i}>
                                                <div className="card border-danger mb-3 mx-2">
                                                    <div className="row no-gutters">
                                                        <div className="col-md-5">
                                                            <img src={camp.campImage} className="card-img" alt="..."/>
                                                        </div>
                                                        <div className="col-md-7">
                                                            <div className="card-body">
                                                                <h5 className="card-title">{camp.campTitle}</h5>
                                                                <button className="btn btn-secondary btn-sm"
                                                                        type="button"
                                                                        onClick={()=>showCamp("camp_card" + i, i)}> Learn more</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Fragment>
                                        )
                                    })}
                                    <div id="fdCard"  className="card border-success mb-3">
                                        <div className="row no-gutters">
                                            <div className="col-md-5">
                                                <img src={trip.fd_image} className="card-img" alt="..."/>
                                            </div>
                                            <div className="col-md-7">
                                                <div className="card-body">
                                                    <h5 className="card-title">{trip.fd_title}</h5>
                                                    <button className="btn btn-secondary btn-sm"
                                                            type="button"
                                                            onClick={()=>showCamp("fn_destination")}> Learn more</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="camp_information">
                                {displayInfo.st_point_card &&  <Fragment>
                                    <div className="card " style={{width: "100%"}}>
                                        <button className="btn btn-sm btn-danger btn_close_card"
                                                onClick={()=>removeCard("st_point_card")}
                                        ><i className="fas fa-times"></i></button>
                                        <div className="row no-gutters">
                                            <div className="col-md-4 card_img_div">
                                                <img src={trip.sp_image} className="card-img" alt="..."/>
                                                <div className="card-img-overlay text-white">
                                                    <h1 className="card-title sp_fd_card_title">{trip.sp_title}</h1>
                                                </div>
                                            </div>
                                            <div className="col-md-8 card_text_div">
                                                <div className="card-body">
                                                    <p className="card-text">{trip.sp_description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Fragment>}
                                {displayInfo.fn_destination_card &&  <Fragment>
                                    <div className="card " style={{width: "100%"}}>
                                        <button className="btn btn-sm btn-danger btn_close_card"
                                                onClick={()=>removeCard("fn_destination_card")}
                                        ><i className="fas fa-times"></i></button>
                                        <div className="row no-gutters">
                                            <div className="col-md-4 card_img_div">
                                                <img src={trip.fd_image} className="card-img" alt="..."/>
                                                <div className="card-img-overlay text-white">
                                                    <h1 className="card-title sp_fd_card_title">{trip.fd_title}</h1>
                                                </div>
                                            </div>
                                            <div className="col-md-8 card_text_div">
                                                <div className="card-body">
                                                    <p className="card-text">{trip.fd_description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Fragment>}
                                {displayInfo.camp_cards && <Fragment>
                                    <div className="card " style={{width: "100%"}}>
                                        <button className="btn btn-sm btn-danger btn_close_card"
                                                onClick={()=>removeCard("camp_cards")}
                                        ><i className="fas fa-times"></i></button>
                                        <div className="row no-gutters">
                                            <div className="col-md-4 card_img_div">
                                                <img src={campInfo.image} className="card-img" alt="..."/>
                                                <div className="card-img-overlay text-white">
                                                    <h1 className="card-title sp_fd_card_title">{campInfo.title}</h1>
                                                </div>
                                            </div>
                                            <div className="col-md-8 card_text_div">
                                                <div className="card-body">
                                                    <p className="card-text">{campInfo.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Fragment>
                                }
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
                            <div id="comments">
                                {trip.comments.length>0?(
                                    <div id="commentsList">
                                        <h5>{trip.comments.length} Comments</h5>
                                        {trip.comments.map((comment, i)=>{
                                            return(
                                                <Fragment key={i}>
                                                    <hr/>
                                                    <div className="comment row">
                                                        <div className="col-1">
                                                            <img src={comment.profileImage} alt=""
                                                                 style={{width: "50px", height: "50px"}}
                                                                 className="rounded-circle"/>
                                                        </div>
                                                        <div className="col-11">
                                                            <div className="comment_header">
                                                                <Link to="">{comment.username}</Link>
                                                                <p>{moment(comment.date).fromNow()}</p>
                                                            </div>
                                                            <p>{comment.text}</p>
                                                            <div className="comment_btns" style={{height: "30px"}}>
                                                                <button className="btn btn-sm btn-success float-left"
                                                                        type="button"
                                                                        onClick={() => {setReply(!reply)}}
                                                                >
                                                                    Reply
                                                                </button>
                                                                {comment.user === user._id && <Fragment>
                                                                    <div className="edit_delete_comment_div">
                                                                        <Link
                                                                            to={"/n/trips/show/"+trip._id+"/comment/"+comment._id}
                                                                            className="btn btm-sm btn-outline-warning"
                                                                        >Edit</Link>
                                                                        <button
                                                                            type="button"
                                                                            className="btn btm-sm btn-outline-danger"
                                                                            onClick={(e)=>removeCommentReply("comment",i, trip._id, comment._id)}
                                                                        >Delete</button>
                                                                    </div>
                                                                </Fragment>}
                                                                <button className="btn btn-sm btn-danger float-right"
                                                                        type="button"
                                                                        onClick={() => addLike(trip._id, comment._id)}
                                                                >
                                                                    {comment.likes.length} <i className="far fa-heart"></i>
                                                                </button>
                                                            </div>
                                                            {comment.replies.length>0 ? (
                                                                <Fragment>
                                                                    {comment.replies.map((reply,i)=>{
                                                                        return(
                                                                            <Fragment key={i}>
                                                                                <hr/>
                                                                                <div className="row">
                                                                                    <div className="col-1">
                                                                                        <img src={reply.profileImage} alt=""
                                                                                             style={{width: "50px", height: "50px"}}
                                                                                             className="rounded-circle"/>
                                                                                    </div>
                                                                                    <div className="col-11">
                                                                                        <div className="comment_header">
                                                                                            <Link to="">{reply.username}</Link>
                                                                                            <p>{moment(reply.date).fromNow()}</p>
                                                                                        </div>
                                                                                        <p>{reply.text}</p>
                                                                                    </div>
                                                                                </div>
                                                                                {reply.user === user._id && <Fragment>
                                                                                    <div className="edit_delete_comment_div">
                                                                                        <button
                                                                                            type="button"
                                                                                            className="btn btm-sm btn-outline-danger"
                                                                                            onClick={(e)=>removeCommentReply("reply",i, trip._id,comment._id)}
                                                                                        >Delete</button>
                                                                                    </div>
                                                                                </Fragment>}
                                                                            </Fragment>
                                                                        )
                                                                    })}
                                                                </Fragment>
                                                            ):(null)}
                                                            {reply &&
                                                            <Fragment>
                                                                <hr/>
                                                                <div className="row">
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
                                                                                    >Comment</button>
                                                                                </div>

                                                                            </div>
                                                                        </form>
                                                                    </div>
                                                                </div>
                                                            </Fragment>
                                                            }
                                                        </div>
                                                    </div>
                                                    <hr/>
                                                </Fragment>

                                            )
                                        })}
                                    </div>
                                ):(
                                    <Fragment>
                                        <p>Still no comments</p>
                                        <hr/>
                                    </Fragment>
                                )}
                            </div>

                        </div>
                    </Fragment>): (null)}
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

export default connect(mapStateToProps,{getTripById, createComment, createReply, addLike, setRating, removeCommentReply})(ShowTrip);