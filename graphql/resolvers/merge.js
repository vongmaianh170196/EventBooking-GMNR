
const Event = require('../../models/Event')
const User = require('../../models/User')


const transformedBooking = booking => {
    return {        
        ...booking._doc,
        _id: booking._doc._id,                
        user: getUserById.bind(this, booking._doc.user),
        event: getEventById.bind(this, booking._doc.event),
        createdAt: dateToString(booking._doc._createdAt),
        updatedAt: dateToString(booking._doc._updatedAt)
    }
}
const transformedEvent = event => {
    return {
        ...event._doc,
        _id: event.id,
        date: dateToString(event._doc.date),
        createdBy: getUserById.bind(this, event.createdBy)
    }
}

const getUserById = async userId => {
    try {
        let user = await User.findById(userId)
        return user
    } catch (error) {
        throw new Error(error)
    }
} 

const getEvents = async eventIds => {
    try {
        const events = await Event.find({_id: {$in: eventIds}});
        return events.map(event => {
            return transformedEvent(event)
        })
    } catch (error) {
        throw error
    }
}


const getEventById = async eventId => {
    try {
        const event = await Event.findById(eventId);
        return transformedEvent(event)
    } catch (error) {
        throw error
    }
}

exports.transformedBooking = transformedBooking;
exports.transformedEvent = transformedEvent
