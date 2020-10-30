import React, {useEffect} from 'react';
import "bootstrap/dist/css/bootstrap.min.css"
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import PrivateRoute from "./components/routing/PrivateRoute";

import Landing from "./components/layout/Landing";

import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

import NewTrip from "./components/trips/NewTrip";
import ShowTrip from "./components/trips/ShowTrip";
import EditTrip from "./components/trips/edit.component";
import Navbar from "./components/layout/Navbar";
import Alert from "./components/layout/Alert"
import Dashboard from "./components/dashboard/Dashboard";
import Skills from "./components/dashboard/Skills";

import Create from "./components/profile-forms/Create";

//Redux
import {Provider} from "react-redux";
import store from "./store";
import setAuthToken from "./utils/setAuthToken";
import {loadUser} from "./actions/auth";

if(localStorage.token){
    setAuthToken(localStorage.token)
}

const App = ()=>{
    useEffect(()=>{
       store.dispatch(loadUser())
    },[])
    return(
        <Provider store={store}>
            <Router>
                <Navbar/>
                <Route exact path="/" component={Landing}/>
                <section className="container">
                    <Alert/>
                    <Switch>
                        <Route exact path="/auth/signin" component={Login}/>
                        <Route exact path="/auth/signup" component={Register}/>
                        <PrivateRoute exact path="/dashboard" component={Dashboard}/>
                        <PrivateRoute exact path="/dashboard/trips" component={Dashboard}/>
                        <PrivateRoute exact path="/dashboard/skills" component={Skills}/>
                        <PrivateRoute exact path="/profile/new" component={Create}/>
                        <Route exact path="/trips/new" component={NewTrip}/>
                        <Route exact path="/trips/show/:id" component={ShowTrip}/>
                        <Route exact path="/trips/edit/:id" component={EditTrip}/>
                    </Switch>
                </section>
            </Router>
       </Provider>
    )
}

export default App;
