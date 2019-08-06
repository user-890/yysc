const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    default: new Date()
  },
  endDate: {
    type: Date
  }
});

module.exports = Task = mongoose.model('task', TaskSchema);
