
const bcrypt = require('bcrypt');
const Event = require('../../models/Event')
const User = require('../../models/User')
const Booking = require('../../models/Booking');


const getUserById = async userId => {
    try {
        let user = await User.findById(userId)
        return user
    } catch (error) {
        throw new Error(error)
    }
} 

const getEventById = async eventId => {
    try {
        const event = await Event.findById(eventId);
        return {
            ...event._doc,
            _id: event._id,
            createdBy: getUserById.bind(this, event.createdBy)
        }
    } catch (error) {
        throw error
    }
}

module.exports = {
    events: async () => {
        try {
            const events = await Event.find();
                return events.map(event => {
                    return {
                        ...event._doc,
                        _id: event._doc._id.toString(),
                        date: new Date(event._doc.date).toISOString(),
                        createdBy: getUserById.bind(this, events._doc._createdBy),
                    }
                })
        } catch (error) {
            
        }
    },
    bookings: async () => {
        try {
            const bookings = await Booking.find()
            return bookings.map(booking => {
                return {
                    ...booking._doc,
                    _id: booking._doc._id,
                    user: getUserById.bind(this, booking._doc.user),
                    event: getEventById.bind(this, booking._doc.event),
                    createdAt: new Date(booking._doc._createdAt).toISOString(),
                    updatedAt: new Date(booking._doc._updatedAt).toISOString()
                }
            })
        } catch (error) {
            throw error
        }
    },
    createEvent: async args => {
        try {
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date)
            })
            const createdEvent = await event.save()
            return {
                ...createdEvent._doc, 
                _id: event._doc._id.toString(),
                date: new Date(event._doc.date).toISOString(),
                createdBy: getUserById.bind(this, event._doc.createdBy)
            }
        } catch (error) {
            throw error
        }
        
    },
    createUser: async args => {
        try {         
            const existed = await User.findOne({email: args.userInput.email})
            if(existed) throw new Error('User is already existed')

            const hashed = await bcrypt.hash(args.userInput.password, 12)
            const user = new User({
                email: args.userInput.email,
                password: hashed
            }) 
            const createdUser = await user.save();
            return {...createdUser._doc, _id: createdUser._id, password: null}
        } catch (error) {
            throw error
        }
    },
    bookEvent: async args => {
        try {            
        const fetchedEvent = await Event.findById(args.eventId);
        const booking = new Booking({
            user: '',
            event: fetchedEvent
        }) 
        const booked = await booking.save();
        return {
                ...booked._doc,
                _id: booking._doc._id,                
                user: getUserById.bind(this, booked._doc.user),
                event: getEventById.bind(this, booked._doc.event),
                createdAt: new Date(booked._doc._createdAt).toISOString(),
                updatedAt: new Date(booked._doc._updatedAt).toISOString()
            }
        } catch (error) {
            throw error
        }
    },
    cancelBooking: async args => {
        try {
            const booking = await Booking.findById(args.bookingId).populate('event');
            const event = {
                ...booking.event._doc, 
                _id: booking.event._doc.id, 
                createdBy: getUserById.bind(this, booking.event._doc.createdBy)}
            await Booking.deleteOne({_id: args.bookingId})
            return event
        } catch (error) {
            throw error
        }
    }
}