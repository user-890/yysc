const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ResourceSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  desc: {
    type: String
  },
  links: [
    {
      link: String,
      url: String
    }
  ],
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      }
    }
  ]
});

module.exports = Resource = mongoose.model('resource', ResourceSchema);
