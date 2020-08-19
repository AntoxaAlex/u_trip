import React, {Component} from 'react';
import {Link} from "react-router-dom";

class Trip extends Component {

    render() {
        return (
            <div className="col-3">
                <div className="card">
                    <div className="card-body">
                        <h1 className="display-4">{this.props.tr_content.title}</h1>
                        <p className="lead">{this.props.tr_content.trip_description}</p>
                        <hr className="my-4"/>
                        <p>{this.props.tr_content.starting_point}</p>
                        <p>{this.props.tr_content.final_destination}</p>
                        <p>{this.props.tr_content.trip_duration}</p>
                        <Link className="btn btn-primary btn-lg" to={"/trips/show/"+this.props.tr_content._id} role="button">Learn more</Link>
                        <Link className="btn btn-warning btn-lg" to={"/trips/edit/"+this.props.tr_content._id}>Edit</Link>
                        <button className="btn btn-danger btn-lg" onClick={this.props.onDeleteTrip.bind(this, this.props.tr_content._id)}>Delete</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Trip;