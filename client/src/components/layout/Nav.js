import React, { Fragment } from 'react'
import {NavLink} from 'react-router-dom'
import '../../css/Nav.css'
import AuthContext from '../../context/auth-context'

export const Nav = () => {
    return <AuthContext.Consumer>
        {(context) => (
        <header className="header-section">
            <div className="nav-logo">
                <h1>Easy Event</h1>
            </div>
            <div className="nav-bar">
                <ul>
                    {!context.token && <li><NavLink to="/auth">Sign in</NavLink></li>}
                    <li><NavLink to="/events">Events</NavLink></li>
                    {context.token && <Fragment>
                        <li><NavLink to="/bookings">Bookings</NavLink></li>
                        <li><button onClick={context.logout}>Sign out</button></li>                        
                        </Fragment>}
                </ul>
            </div>
        </header>
    ) }
    </AuthContext.Consumer>
}
