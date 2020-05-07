import React from 'react'
import '../../css/Events.css'

export const EventItem = ({event, onDetail, userId}) => {
    return (
        <li className="events-list-item">
            <div>
                <h1>{event.title}</h1>
                <h2>
                    ${event.price} - {new Date(event.date).toLocaleDateString()}
                </h2>
                </div>
                <div>
                {userId === event.createdBy._id ? (
                    <p>Your the owner of this event.</p>
                ) : (
                    <button className="btn" onClick={onDetail.bind(this, event._id)}>
                    View Details
                    </button>
                )}
            </div>
        </li>
    )
}
