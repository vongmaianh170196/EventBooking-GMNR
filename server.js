const express = require('express');
const mongoose = require("mongoose");
const expressGraphql = require('express-graphql')

const schema = require('./graphql/schema/index');
const resolvers = require('./graphql/resolvers/index')
const app = express();



app.use(express.json({
    extended: false
}));




app.use('/graphql', expressGraphql({
    //query: fetch data
    //muation: changing data
    schema: schema,
    //rootvalue: bundels of resolver, name of resolver has to be the same as name in rootquery
    rootValue:resolvers,
    graphiql: true
}))

//Connect database
mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@eventbooking-1m2a0.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
.then(() => {
    app.listen(5000)
    console.log("Connected to Databse")
})
.catch(err => console.log(err))

