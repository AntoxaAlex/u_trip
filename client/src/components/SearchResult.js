import React,{Fragment, useState, useEffect} from "react";
import {useParams} from "react-router";
import {connect} from "react-redux"
import {searchValue} from "../actions/search";
import PropTypes from "prop-types";
import Spinner from "./layout/Spinner";
import {Carousel, FormControl} from "react-bootstrap";
import {Link} from "react-router-dom";

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
                {tripsWithUser ? (<Fragment>
                    <p>tripsWithUser</p>
                </Fragment>): null}
                {users ? (<Fragment>
                    <p>users</p>
                </Fragment>): null}
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