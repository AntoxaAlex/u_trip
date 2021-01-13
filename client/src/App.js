import React, {useEffect} from 'react';
import "bootstrap/dist/css/bootstrap.min.css"
import {BrowserRouter as Router, Route} from "react-router-dom";
import PrivateRoute from "./components/routing/PrivateRoute";
import {Provider} from "react-redux";
import store from "./store";
import setAuthToken from "./utils/setAuthToken";
import {loadUser} from "./actions/auth";

import Alert from "./components/layout/Alert"
import Landing from "./components/layout/Landing";
import NavbarComponent from "./components/layout/Navbar";

import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

import Home from "./components/Home";

import Create from "./components/profile-forms/Create";
import EditProfile from "./components/profile-forms/EditProfile";

import NewTrip from "./components/trips/NewTrip";
import ShowTrip from "./components/trips/ShowTrip";

import Dashboard from "./components/dashboard/Dashboard";
import DashboardById from "./components/dashboard/DashboardById";

import SearchResult from "./components/SearchResult";




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
                <Route exact path="/" component={Landing}/>
                <Route path="/n">
                    <section id="mainContainer" className="container-fluid">
                        <NavbarComponent path ="/n"/>
                        <Alert/>
                        <Route path="/n/auth">
                            <section id="registerContainer" className="container">
                                <Route exact path="/n/auth/signin" component={Login}/>
                                <Route exact path="/n/auth/signup" component={Register}/>
                            </section>
                        </Route>
                        <Route exact path="/n/home" component={Home}/>
                        <PrivateRoute exact path="/n/dashboard" component={Dashboard}/>
                        <Route exact path="/n/dashboard/:id" component={DashboardById}/>
                        <PrivateRoute exact path="/n/profile/new" component={Create}/>
                        <PrivateRoute exact path="/n/profile/edit" component={EditProfile}/>
                        <Route exact path="/n/trips/new" component={NewTrip}/>
                        <Route exact path="/n/trips/show/:id" component={ShowTrip}/>
                        <PrivateRoute exact path="/n/trips/edit/:id" component={NewTrip}/>
                        <Route exact path="/n/search/:value" component={SearchResult}/>
                    </section>
                </Route>
            </Router>
       </Provider>
    )
}

export default App;
