const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ResourceSchema = new Schema({
  file: {
    data: Buffer
  }
});

module.exports = Resource = mongoose.model('resource', ResourceSchema);
