import React , {Fragment} from 'react';
import {connect} from "react-redux";
import PropTypes from "prop-types";

const Skills = ({auth:{user}, profile:{profile, loading}}) =>{
    return (
        <Fragment>
            <div className="row">
                <div className="col-2">
                    <p><i className="fas fa-skiing"></i>  Preferences</p>
                    <p><i className="far fa-clock"></i>  Days in trip</p>
                </div>
                <div className="col-10">
                    <p>{profile.preferences}</p>
                    <p>{profile.tripdays}</p>

                </div>
            </div>
        </Fragment>
    );
}

Skills.propTypes = {
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile
})

export default connect(mapStateToProps, null)(Skills);