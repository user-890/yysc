const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  conversationId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  body: {
    type: String
  },
  timestamp: {
    type: String,
    default: Date.now
  }
});

module.exports = Message = mongoose.model('message', MessageSchema);