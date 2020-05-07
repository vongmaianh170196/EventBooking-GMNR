import React, { Fragment, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { EnventModal } from '../Modal/EnventModal';
import '../../css/Events.css'
import { Backdrop } from '../Modal/Backdrop';
import AuthContext from '../../context/auth-context'
import { EventItem } from './EventItem';

export const Events = () => {
    const [events, loadEvents] = useState([])
    const [isLoaded, loaded] = useState(false)
    
    useEffect(() => {
        if(!isLoaded) {
            const fetchEvents = async () => {
                let query = {
                    query: `
                        query {
                            events{
                                _id
                                title,
                                description,
                                date,
                                price,
                                createdBy {
                                    _id
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
                                'Content-Type': 'application/json'
                            }
                        }
                    )
                    loaded(true)
                    return loadEvents(res.data.data.events)
                } catch (error) {
                    console.log(error)
                }
            }
            fetchEvents();            
        }
    }, [isLoaded])
    const context = useContext(AuthContext);
    const config = {
        headers:{
            'Content-type': 'application/json',
            'x-auth-token': context.token
        }
    }
    const [creating, setCreating] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        price: 0,
        date: '',
        description: ''
    });
    const [selectedEvent, setSelectedEvent] = useState(null)
    const {title, price, date, description} = formData;

    const onChange = e => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    const onConfirmModal = async () => {
        setCreating(false);
        const event = {
            title, 
            price, 
            date, 
            description,
            createdBy: {
                _id: context.userId
            }
         }
        let query = {
            query: `
                mutation {
                    createEvent(eventInput:{title: "${title}", description: "${description}", price: ${parseFloat(price)}, date: "${date}"}){
                        _id
                        title,
                        description,
                        date,
                        price,
                        createdBy {
                            _id
                            email
                        }
                    }
                }
            `
        }
        try {
            const res = await axios.post('/graphql', JSON.stringify(query), config)
            const resData = res.data
            const errors = resData.errors
            if(errors){
                errors.forEach(err => {
                    alert(err.message)
                });
            }
            else{
               loadEvents([...events, event])
            }
        } catch (error) {
            console.log(error)
        }
    }

    const onBookEvent = async () => {
        let query = {
            query: `
                mutation {
                  bookEvent(eventId: "${selectedEvent._id}") {
                    _id
                   createdAt
                   updatedAt
                  }
                }
              `
          };
        try {
            const res = await axios.post('/graphql', 
                JSON.stringify(query), 
                config
            )
            console.log(res.data)
            setSelectedEvent(null)
        } catch (error) {
            console.log(error)
        }
    }
    const onViewDetail = eventId => {
        setSelectedEvent(events.find(evt => evt._id === eventId))
    }
    return <Fragment>
        {/* Add event modal */}
        {creating && <Fragment>
            <Backdrop/>
            <EnventModal 
                title="Add an event" 
                canCancel 
                canConfirm 
                onConfirm={onConfirmModal} 
                onCancel={() => setCreating(false)}
                confirmText="Confirm"
            >
                <form>
                    <div className="form-control">
                        <label htmlFor="title">Title</label>
                        <input required type="text" name="title" id="title" defaultValue={title} onChange={e => onChange(e)}/>
                    </div>
                    <div className="form-control">
                        <label htmlFor="price">Price</label>
                        <input required type="number" name="price" id="price" defaultValue={price} onChange={e => onChange(e)}/>
                    </div>
                    <div className="form-control">
                        <label htmlFor="date">Date</label>
                        <input required type="date" name="date" id="date" defaultValue={date} onChange={e => setFormData({...formData, date: new Date(e.target.value).toISOString()})}/>
                    </div>
                    <div className="form-control">
                        <label htmlFor="description">Description</label>
                        <textarea required name="description" id="description" rows="4" defaultValue={description} onChange={e => onChange(e)}/>
                    </div>
                </form>
            </EnventModal>
            
        </Fragment>} {/*End  Add event modal */}
        {/* Show event details modal */}
        {selectedEvent && <Fragment>
            <Backdrop/>
            <EnventModal 
                title={selectedEvent.title} 
                canCancel 
                canConfirm 
                onConfirm={onBookEvent} 
                onCancel={() => setSelectedEvent(null)}
                confirmText={context.token ? "Book": "Confirm"}
            >
                <h1>{selectedEvent.title}</h1>
                <h2>
                    ${selectedEvent.price} - {new Date(selectedEvent.date).toLocaleDateString()}
                </h2>
                <p>{selectedEvent.description}</p>
            </EnventModal>
            
        </Fragment>} {/*End show event detailsmodal */}
        {context.token && <div className="events-control">
           <button className="btn" onClick={() => setCreating(true)}>Create an event</button>
        </div>}
        <ul className="events-list">
            {!isLoaded ? "Loading" :events.map(evt => <EventItem 
                key={evt._id} 
                event={evt}
                userId={context.userId}
                onDetail={onViewDetail}
            /> )}
        </ul>
    </Fragment>
}
