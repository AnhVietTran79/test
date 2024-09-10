const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'This field is required.'],
  },
  description: {
    type: String,
    required: [true, 'This field is required.'],
  },
  category: {
    type: String,
    enum: ['Music', 'Sport', 'Live Show'],
    required: [true, 'This field is required.'],
  },
  image: {
    type: String,
    required: [true, 'This field is required.'],
  },
  date: {
    type: Date,
    required: [true, 'This field is required.'],
  },
  venue: {
    type: String,
    required: [true, 'This field is required.'],
  },
  ticketType: {
    type: String,
    required: [true, 'This field is required.'],
  },
  price: {
    type: Number,
    required: [true, 'This field is required.'],
  }
});

// Full-text search index
eventSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Event', eventSchema);

