import React, {Component} from 'react';
import axios from "axios"
import Trip from "./Trip";

class Home extends Component {
    constructor(props) {
        super(props);
        this.state={trips:[]}
    }
    componentDidMount(){
        axios.get("http://localhost:4000/trips/home").then(response => {
            this.setState({ trips: response.data });
        })
            .catch(function (error){
                console.log(error);
            })
    }
    onDeleteTrip = (id)=>{
        this.setState({ trips: [...this.state.trips.filter(trip=> trip._id !== id)] })
        axios.delete("http://localhost:4000/trips/delete/"+id)
            .then(res => console.log("Delete trip " + res.data.title))
    }

    tripsList(){
        return this.state.trips.map((trip,i)=>{
            return <Trip tr_content={trip} key={i} onDeleteTrip={this.onDeleteTrip}/>
        })
    }

    render() {
        return (
            <div className="row">
                {this.tripsList()}
            </div>
        );
    }
}

export default Home;