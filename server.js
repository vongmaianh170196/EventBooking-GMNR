const express = require('express');
const mongoose = require("mongoose")
const expressGraphql = require('express-graphql')
const {buildSchema} = require('graphql')

const app = express();

const events = []

app.use(express.json({
    extended: false
}));

app.use('/graphql', expressGraphql({
    //query: fetch data
    //muation: changing data
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }        
        input EventInput{
            title: String!
            description: String!
            price: Float!
            date: String!
        } 
        type RootQuery {
            events: [Event!]!
        }
        type RootMutation{
            createEvent(eventInput: EventInput): Event
        }
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    //rootvalue: bundels of resolver, name of resolver has to be the same as name in rootquery
    rootValue:{
        events: () => {
            return events
        },
        createEvent: args => {
            const event = {
                _id: Math.random().toString(),
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: args.eventInput.date
            }  
            events.push(event);  
            return event;  
        }
    },
    graphiql: true
}))

//Connect database
mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@eventbooking-1m2a0.mongodb.net/eventsBooKingDb?retryWrites=true&w=majority`)
.then(() => app.listen(5000))
.catch(err => console.log(err))

