
const Event = require('../../models/Event')
const Booking = require('../../models/Booking');
const {transformedBooking, transformedEvent} = require('./merge')



module.exports = {    
    bookings: async (args, req) => {
        try {
            
            if(!req.isAuth) throw new Error("Unauthenicated")
            const bookings = await Booking.find({user:req.userId})
            return bookings.map(booking => {
                return transformedBooking(booking)
            })
        } catch (error) {
            throw error
        }
    },
    
    bookEvent: async (args, req) => {
        try {    
            if(!req.isAuth) throw new Error("Unauthenicated")        
            const fetchedEvent = await Event.findOne({ _id: args.eventId });
            const booking = new Booking({
                user: req.userId,
                event: fetchedEvent
            });
            const booked = await booking.save();
            return transformedBooking(booked)
        } catch (error) {
            throw error
        }
    },
    cancelBooking: async (args, req) => {
        try {            
            if(!req.isAuth) throw new Error("Unauthenicated")
            const booking = await Booking.findById(args.bookingId).populate('event');
            const event = transformedEvent(booking.event)
            await Booking.deleteOne({_id: args.bookingId})
            return event
        } catch (error) {
            throw error
        }
    }
}
