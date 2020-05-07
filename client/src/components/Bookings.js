import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios'
import AuthContext from '../context/auth-context'

export const Bookings = () => {
    const context = useContext(AuthContext)
    const [isLoaded, loaded] = useState(false);
    const [bookings, loadBookings] = useState([])
    useEffect(() => {
        if(!isLoaded) {
            const fetchBookings = async () => {
                let query = {
                    query: `
                        query {
                            bookings{
                                _id
                               createdAt
                               event{
                                   _id
                                   title
                                   date
                               }
                               user{
                                   email
                               }
                            }
                        }
                    `
                }
                try {
                    const res = await axios.post('/graphql', 
                        JSON.stringify(query), 
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'x-auth-token': context.token
                            }
                        }
                    )
                    loaded(true)
                    return loadBookings(res.data.data.bookings)
                } catch (error) {
                    console.log(error)
                }
            }
            fetchBookings();            
        }
    }, [isLoaded])
    return (
        <div>
            <ul>
    {bookings.map(booking => <li key={booking._id}>{booking.event.title}</li>)}
            </ul>
        </div>
    )
}
