import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css"
import {BrowserRouter as Router, Route} from "react-router-dom";

import Intro from "./components/landing/intro.component";

import Login from "./components/auth/login.component";
import Register from "./components/auth/register.component";

import Home from "./components/trips/home.component";
import NewTrip from "./components/trips/new.component";
import ShowTrip from "./components/trips/show.component";
import EditTrip from "./components/trips/edit.component";
import Header from "./components/trips/layout/Header";

function App() {
  return (
      <Router>
          <Route exact path="/" component={Intro}/>
          <div className="container">
              <Route exact path="/auth/login" component={Login}/>
              <Route exact path="/auth/register" component={Register}/>
              <Route path="/trips/" component={Header}/>
              <Route exact path="/trips/home" component={Home}/>
              <Route exact path="/trips/new" component={NewTrip}/>
              <Route exact path="/trips/show/:id" component={ShowTrip}/>
              <Route exact path="/trips/edit/:id" component={EditTrip}/>
          </div>
      </Router>
  );
}

export default App;
