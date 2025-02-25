const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const eventShcema = new Schema({
    title: {
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('Event', eventShcema);
