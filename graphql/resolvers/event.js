
const Event = require('../../models/Event')
const User = require('../../models/User')
const {transformedEvent} = require('./merge')


module.exports = {
    events: async () => {
        try {
            const events = await Event.find();
                return events.map(event => {
                    return transformedEvent(event)
                })
        } catch (error) {
            
        }
    },
    createEvent: async (args, req) => {
        try {
            if(!req.isAuth) throw new Error("Unauthenicated")
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date),
                createdBy: req.userId
            })
            const createdEvent = await event.save()
            const createdBy = await User.findById(req.userId);
            createdBy.createdEvents.push(createdEvent)
            await createdBy.save()
            return transformedEvent(createdEvent)
        } catch (error) {
            throw error
        }
        
    }
}