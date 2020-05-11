import React from 'react';
import '../../css/Booking.css'

export const BookingItem = ({booking, onCancel}) => {
    return (
        <li className="bookings-item">
            <div className="bookings-item-data">
                {booking.event.title} - {' '} {new Date(booking.createdAt).toLocaleDateString()}
            </div>
            <div className="bookings-item-actions">
                <button className="btn" onClick={onCancel.bind(this, booking._id)}>Cancel</button>
            </div>
        </li>
    )
}
