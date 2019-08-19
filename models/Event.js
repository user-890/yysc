const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    category: {
        type: String,
        required: true
    },
    action: {
        type: String,
        required: true
    },
    payload: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Event = mongoose.model('event', EventSchema);