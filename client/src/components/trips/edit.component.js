import React, {Component} from 'react';
import axios from "axios";


class EditTrip extends Component {

    constructor(props) {
        super(props);

        this.onChangeTitle = this.onChangeTitle.bind(this);
        this.onChangeStPoint = this.onChangeStPoint.bind(this);
        this.onChangeFnDestionation = this.onChangeFnDestionation.bind(this);
        this.onChangeDuration = this.onChangeDuration.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onSubmit = this.onSubmit.bind(this)

        this.state={
            title:"",
            st_point: "",
            fn_destination: "",
            duration: "",
            description: ""
        }

    }



    componentDidMount(){
        console.log(this.props)
        axios.get("http://localhost:4000/trips/edit/"+this.props.match.params.id).then(response => {
            this.setState({
                title: response.data.title,
                st_point: response.data.starting_point,
                fn_destination: response.data.final_destination,
                duration: response.data.trip_duration,
                description: response.data.trip_description
            });
            console.log(response.data)
        })
            .catch(function (error){
                console.log(error);
            })
    }

    onChangeTitle(e){
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

    onSubmit = (e)=>{
        e.preventDefault();

        const obj = {
            title: this.state.title,
            starting_point: this.state.st_point,
            final_destination: this.state.fn_destination,
            trip_duration: this.state.duration,
            trip_description: this.state.description
        }

        axios.post("http://localhost:4000/trips/edit/"+this.props.match.params.id, obj)
            .then(res => {
                this.props.history.push('/trips');
                console.log(res.data)
            });

    }

    render() {
        return (
            <div>
                <h2>Edit Trip</h2>
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
                            onChange={this.onChangeDescription}
                            defaultValue={this.state.description}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        );
    }
}

export default EditTrip;