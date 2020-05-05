import React, { Fragment, useState } from 'react';
import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom';
import './App.css';
import { Auth } from './components/Auth';
import { Events } from './components/Events';
import { Bookings } from './components/Bookings';
import { Nav } from './components/layout/Nav';
import AuthContext from './context/auth-context'

function App() {  
  const [authContext, setAuthContext] = useState({
    token: null,
    userId: null
  })
  const login=(token, userId, tokenExpiration) => {
    setAuthContext({token: token, userId: userId})
  }
  const logout = () => {
    setAuthContext({token: null, userId: null})
  }
  return (
    <BrowserRouter>
      <Fragment>
        <AuthContext.Provider value={{
              token: authContext.token, 
              userId: authContext.userId,
              login: login,
              logout: logout
            }}>
          <Nav/>
          <main className="main-container">
            <Switch>  
              {!authContext.token && <Redirect from="/" to="/auth" exact/>}
              {!authContext.token && <Route path="/auth" component={Auth}/>}
              {authContext.token && <Redirect from="/" to="/events" exact/>}
              {authContext.token && <Redirect from="/auth" to="/events" exact/>}
              <Route path="/events" component={Events}/>
              {authContext.token && <Route path="/bookings" component={Bookings}/>}
            </Switch>
          </main>
        </AuthContext.Provider>
        </Fragment>
    </BrowserRouter>
  );
}

export default App;
