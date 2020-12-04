import React,{Fragment, useEffect, useState} from "react";
import {Redirect, useParams} from "react-router";
import {connect} from "react-redux";
import {getCommentById, editComment} from "../../actions/trips";
import PropTypes from "prop-types";
import Spinner from "../layout/Spinner";

const EditComment = ({getCommentById, editComment, comment,trip:{isCompleted}})=>{

    const {id, comment_id} = useParams()

    useEffect(()=>{
        getCommentById(id, comment_id)
    },[getCommentById])

    const[commentState, setCommentState] = useState({
        text: ""
    })
    const [isSubmited, setSubmit]=useState(false)

    const {text} = commentState

    if(isSubmited){
        return <Redirect to={"/n/trips/show/"+id}/>
    }




    return(
        <Fragment>
            {comment.comment === null && comment.loading ? (<Spinner/>):(<Fragment>

                <form onSubmit={(e)=>{
                    e.preventDefault();
                    editComment(text, id, comment_id)
                    setSubmit(true)
                }}>
                    <textarea
                    name="text"
                    autoComplete="off"
                    onChange={(e)=>setCommentState({...commentState, [e.target.name]: e.target.value})}
                    >
                        {comment.comment.text}
                    </textarea>

                    <button
                        type="submit"
                        className="btn btn-success"
                    >Submit</button>
                </form>
            </Fragment>)}
        </Fragment>
        )
}

EditComment.propTypes = {
    getCommentById: PropTypes.func.isRequired,
    editComment: PropTypes.func.isRequired,
    comment: PropTypes.object.isRequired,
    trip: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    comment: state.comment,
    trip: state.trips
})

export default connect(mapStateToProps,{getCommentById, editComment})(EditComment)