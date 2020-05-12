import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios'
import { Bar as BarChart} from 'react-chartjs-2'
import AuthContext from '../../context/auth-context'
import '../../css/Booking.css'
import { BookingItem } from './BookingItem';

export const Bookings = () => {
    const context = useContext(AuthContext)
    const [isLoaded, loaded] = useState(false);
    const [bookings, loadBookings] = useState([])
    const [showChart, setShow] = useState(false)
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
                                   price
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
    }, [isLoaded, context.token])

    const deleteBookingItem = async bookingId => {
        let query = {
            query: `
                mutation CancelBooking($id: ID!){
                    cancelBooking(bookingId: $id){
                        _id
                       title
                    }
                }
            `,
            variables:{
                id: bookingId
            }
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
            
            return loadBookings(bookings.filter(ele => ele._id !== bookingId))
        } catch (error) {
            console.log(error)
        }
    
    }

    const renderBookingList = () => <ul>
        {bookings.map(booking => <BookingItem key={booking._id} booking={booking} onCancel={deleteBookingItem}/>)}
    </ul>
    const renderBookingChart = () => {
        const BOOKINGS_BUCKETS = {
            Cheap: {
                min: 0,
                max: 100
              },
            Normal: {
                min: 100,
                max: 200
            },
            Expensive: {
                min: 200,
                max: 10000000
            }
        }
        const chartData={labels: [], datasets: []}
        let values = [];
        for(const bucket in BOOKINGS_BUCKETS){
            const filterBookingsCount = bookings.reduce((prev, current) => {
                if (
                    current.event.price > BOOKINGS_BUCKETS[bucket].min &&
                    current.event.price < BOOKINGS_BUCKETS[bucket].max
                  ) {
                    return prev + 1;
                  } else {
                    return prev;
                  }
                }, 0);
            values.push(filterBookingsCount)
            chartData.labels.push(bucket);
            chartData.datasets.push({
                fillColor: 'rgba(220,220,220,0.5)',
                strokeColor: 'rgba(220,220,220,0.8)',
                highlightFill: 'rgba(220,220,220,0.75)',
                highlightStroke: 'rgba(220,220,220,1)',
                data: values
            })
            values = [...values]
            values[values.length -1] = 0
        }
        console.log(chartData)
        return  <div style={{ textAlign: 'center' }}>
                    <BarChart data={chartData} />
                </div>
    }
    return (
        <div>
            <div className="bookings-control">
                <button onClick={() => setShow(false)} className={!showChart ? "active" : ''}>List</button>
                <button onClick={() => setShow(true)} className={showChart ? "active" : '' }>Chart</button>
            </div>
           { showChart ? renderBookingChart(): renderBookingList() }
          
        </div>
    )
}
