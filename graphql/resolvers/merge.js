const DataLoader = require('dataloader')
const Event = require('../../models/Event')
const User = require('../../models/User')
const {dateToString} = require('../../helpers/date')

const eventLoader = new DataLoader(eventIds => {
    return getEvents(eventIds);
});
const userLoader = new DataLoader(userIds => {
    return User.find({_id: {$in:userIds}});
})
const transformedBooking = booking => {
    return {        
        ...booking._doc,
        _id: booking._doc._id,                
        user: getUserById.bind(this, booking._doc.user),
        event: getEventById.bind(this, booking._doc.event),
        createdAt: dateToString(booking.createdAt),
        updatedAt:  dateToString(booking.updatedAt)
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
        let user = await userLoader.load(userId.toString())
        return {
            ...user._doc,
            _id: user._id,
            createdEvents: () => eventLoader.loadMany(user._doc.createdEvents)
        }
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
        const event = await eventLoader.load(eventId.toString());
        return event
    } catch (error) {
        throw error
    }
}

exports.transformedBooking = transformedBooking;
exports.transformedEvent = transformedEvent
