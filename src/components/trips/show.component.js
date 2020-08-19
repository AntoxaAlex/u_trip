import React, {Component} from 'react';
import axios from "axios";

class ShowTrip extends Component {

    constructor(props) {
        super(props);
        this.state={
            title:"",
            st_point: "",
            fn_destination: "",
            duration: "",
            description: ""
        }
    }
    componentDidMount(){
        axios.get("http://localhost:4000/trips/show/"+this.props.match.params.id).then(response => {
            this.setState({
                title: response.data.title,
                st_point: response.data.starting_point,
                fn_destination: response.data.final_destination,
                duration: response.data.trip_duration,
                description: response.data.trip_description
            });
        })
            .catch(function (error){
                console.log(error);
            })
    }

    render() {
        return (
            <div className="jumbotron">
                <h1 className="display-4">{this.state.title}</h1>
                <p className="lead">{this.state.description}</p>
                <hr className="my-4"/>
                <p>{this.state.st_point}</p>
                <p>{this.state.fn_destination}</p>
                <p>{this.state.duration}</p>

            </div>
        );
    }
}

export default ShowTrip;