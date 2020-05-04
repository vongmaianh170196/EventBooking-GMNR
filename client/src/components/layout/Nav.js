import React from 'react'
import {NavLink} from 'react-router-dom'
import '../../css/Nav.css'

export const Nav = () => {
    return (
        <header className="header-section">
            <div className="nav-logo">
                <h1>Easy Event</h1>
            </div>
            <div className="nav-bar">
                <ul>
                    <li><NavLink to="/auth">Login</NavLink></li>
                    <li><NavLink to="/events">Events</NavLink></li>
                    <li><NavLink to="/bookings">Bookings</NavLink></li>
                </ul>
            </div>
        </header>
    )
}
