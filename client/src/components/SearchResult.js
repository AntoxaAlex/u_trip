import React,{Fragment, useState, useEffect} from "react";
import {useParams} from "react-router";
import {connect} from "react-redux"
import {searchValue} from "../actions/search";
import PropTypes from "prop-types";
import Spinner from "./layout/Spinner";
import {Carousel, FormControl} from "react-bootstrap";
import {Link} from "react-router-dom";
import ReactStars from "react-rating-stars-component";
import moment from "moment";

const SearchResult = ({searchValue, searchResult:{trips, tripsWithUser, users, loading}}) =>{
    const {value} = useParams()

    const[searchedValue, setSearchedValue] = useState({
        value: null,
        isSubmitted: false
    })

    useEffect(()=>{
        searchValue(value)
    },[loading])

    const onSubmitSearch = (e) =>{
        e.preventDefault()
        setSearchedValue({...searchedValue,isSubmitted: true})
        if(searchedValue.isSubmitted){
            searchValue(searchedValue.value)
        }
    }

   return(
        <Fragment>
            {!loading ? (<Fragment>
                <div id="introDiv">
                    <h1> Found results: <span id="searchPageHeaderSpan"/>{(trips ? trips.length : 0)+(tripsWithUser ? tripsWithUser.length : 0)+(users ? users.length : 0)}</h1>
                    <form onSubmit={(e)=>onSubmitSearch(e)} >
                        <FormControl type="text" placeholder="Search" className=" mr-sm-2" size="sm" onChange={(e)=>setSearchedValue({...searchedValue,value: e.target.value})}/>
                        <button type="submit">
                            Submit
                        </button>
                    </form>
                </div>
                {trips ? (<Fragment>
                    <h1>{trips.length} trips</h1>
                    <Carousel className="mb-4">
                        {trips.map((trip, i)=>{
                            return(
                                <Carousel.Item key={i}>
                                    <img
                                        className="d-block w-100"
                                        src={trip.st_point.sp_image}
                                        alt="First slide"
                                    />
                                    <Carousel.Caption>
                                        <h1><Link className="nav-link text-white" to={"/n/trips/show/"+trip._id}>{trip.title}</Link></h1>
                                        <p>{trip.trip_description.slice(0,140)+"..."}</p>
                                    </Carousel.Caption>
                                </Carousel.Item>
                            )
                        })}
                    </Carousel>
                </Fragment>): null}
                {tripsWithUser ? (<div id="bestTripsContainer">
                    <h3 className="homeContentHeader">Trips with user</h3>
                    <div id="bestTripsDiv">
                        {tripsWithUser.map((trip,i)=>{
                            return(
                                <div key={i} className="tripsGridItem">
                                    <img src={trip.st_point.sp_image} style={{width: "100%", borderRadius: "15px 15px 0 0"}} alt="..."/>

                                    <div className="tripsInformation" style={{width: "100%"}}>
                                        <h5 className="text-center">
                                            <Link className="nav-link text-white" to={"/n/trips/show/"+trip._id}>{trip.title}</Link>
                                        </h5>
                                        <div style={{width: "100%", padding: "10px 20px"}}>
                                            <small className="float-left">Duration: </small>
                                            <small className="float-right">
                                                <ReactStars
                                                    className="my-5"
                                                    value={trip.generalRating}
                                                    count={5}
                                                    size={20}
                                                    activeColor="#ffd700"
                                                    isHalf={true}
                                                    emptyIcon={<i className="far fa-star"/>}
                                                    halfIcon={<i className="fas fa-star-half"/>}
                                                    fullIcon={<i className="fas fa-star"/>}
                                                />
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>): null}
                {users ? (<div id="bestUsersContainer">
                    <h3 className="homeContentHeader">Users</h3>
                    <div id="bestUsersDiv">
                        {users.map((user,i)=>{
                            return(
                                <div key={i} className="userGridItem">
                                    <img src={user.imageUrl} className="rounded-circle" style={{width: "100px", height: "100px", border: "green", marginBottom: "40px"}} alt="..."/>
                                    <div className="userInformation">
                                        <table>
                                            <tbody>
                                            <tr>
                                                <td><strong>Name:</strong></td>
                                                <td><Link className="nav-link d-inline text-info" to={"/n/dashboard/"+user.user._id}>{user.user.firstname}</Link></td>
                                            </tr>
                                            <tr>
                                                <td><strong>Dob:</strong></td>
                                                <td className="userTableTd">{moment(user.dob).format("MM-DD-YYYY")}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Gender:</strong></td>
                                                <td className="userTableTd">{user.gender}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Level:</strong></td>
                                                <td className="userTableTd"><strong className="levelSpan">{user.level}</strong></td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>): null}
            </Fragment>) : <Spinner/>}
        </Fragment>
    )
}

SearchResult.prototype ={
    searchResult: PropTypes.object.isRequired
}

const mapStateToProps = state =>({
    searchResult: state.search
})

export default connect(mapStateToProps, {searchValue})(SearchResult)