import React, { Fragment } from 'react';
import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom';
import './App.css';
import { Auth } from './components/Auth';
import { Events } from './components/Events';
import { Bookings } from './components/Bookings';
import { Nav } from './components/layout/Nav';

function App() {
  return (
    <BrowserRouter>
      <Nav/>
      <Fragment>
        <main className="main-container">
          <Switch>  
            <Redirect from="/" to="/auth" exact/>
            <Route path="/auth" component={Auth}/>
            <Route path="/events" component={Events}/>
            <Route path="/bookings" component={Bookings}/>
          </Switch>
        </main>
      </Fragment>
    </BrowserRouter>
  );
}

export default App;
