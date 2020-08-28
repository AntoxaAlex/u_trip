import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css"
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

import Landing from "./components/layout/Landing";

import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

import Home from "./components/trips/home.component";
import NewTrip from "./components/trips/new.component";
import ShowTrip from "./components/trips/show.component";
import EditTrip from "./components/trips/edit.component";
import Navbar from "./components/layout/Navbar";

const App = ()=>(
      <Router>
          <Navbar/>
          <Route exact path="/" component={Landing}/>
          <section className="container">
              <Switch>
                  <Route exact path="/auth/signin" component={Login}/>
                  <Route exact path="/auth/signup" component={Register}/>
              </Switch>
              <Switch>
                  <Route exact path="/trips/home" component={Home}/>
                  <Route exact path="/trips/new" component={NewTrip}/>
                  <Route exact path="/trips/show/:id" component={ShowTrip}/>
                  <Route exact path="/trips/edit/:id" component={EditTrip}/>
              </Switch>
          </section>
      </Router>
  )

export default App;
