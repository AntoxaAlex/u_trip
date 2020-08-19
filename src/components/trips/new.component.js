import React, {Component} from 'react';
import axios from "axios"

class NewTrip extends Component {
    //I add constructor because state will be initialized
    constructor(props) {
        super(props);

        /*Because in the four implemented methods we’re dealing with the component’s state object
         we need to make sure to bind those methods to this by adding the following lines of code
         to the constructor*/
        this.onChangeTitle = this.onChangeTitle.bind(this);
        this.onChangeStPoint = this.onChangeStPoint.bind(this);
        this.onChangeFnDestionation = this.onChangeFnDestionation.bind(this);
        this.onChangeDuration = this.onChangeDuration.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onSubmit = this.onSubmit.bind(this)

        this.state = {
            title:"",
            st_point: "",
            fn_destination: "",
            duration: "",
            description: ""
        }
    }

       // Methods for updating state properties
        onChangeTitle(e) {
            this.setState({
                title: e.target.value
            })
        }

        onChangeStPoint(e) {
            this.setState({
                st_point: e.target.value
            })
       }
        onChangeFnDestionation(e) {
            this.setState({
                fn_destination: e.target.value
            })
        }
        onChangeDuration(e) {
            this.setState({
                duration: e.target.value
            })
        }
        onChangeDescription(e) {
            this.setState({
                description: e.target.value
            })
        }

        //Method for handle submit
        onSubmit(e) {
            e.preventDefault();

            const newTrip = {
                title: this.state.title,
                starting_point: this.state.st_point,
                final_destination: this.state.fn_destination,
                trip_duration: this.state.duration,
                trip_description: this.state.description
            }

            axios.post("http://localhost:4000/trips/", newTrip)
                .then(res => {
                    this.props.history.push('/trips');
                    console.log("Create new trip " + res.data)
                })

            //Reset the state object
            this.setState({
                title:"",
                st_point: "",
                fn_destination: "",
                duration: "",
                description: ""
            })

        }

    render() {
        return (
            <div>
                <h2>Create New Trip</h2>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            className="form-control"
                            id="title"
                            autoComplete="off"
                            autoFocus
                            value={this.state.title}
                            onChange={this.onChangeTitle}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="startingPoint">Starting point</label>
                        <input
                            type="text"
                            className="form-control"
                            id="startingPoint"
                            autoComplete="off"
                            value={this.state.st_point}
                            onChange={this.onChangeStPoint}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="finalDestination">Final destination</label>
                        <input
                            type="text"
                            className="form-control"
                            id="finalDestination"
                            autoComplete="off"
                            value={this.state.fn_destination}
                            onChange={this.onChangeFnDestionation}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="duration">Duration</label>
                        <input
                            type="number"
                            className="form-control"
                            id="duration"
                            value={this.state.duration}
                            onChange={this.onChangeDuration}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            className="form-control"
                            id="description"
                            value={this.state.destination}
                            onChange={this.onChangeDescription}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        );
    }
}

export default NewTrip;