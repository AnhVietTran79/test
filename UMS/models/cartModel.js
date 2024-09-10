const mongoose = require('mongoose');
const Event = require('./eventModel');
const User = require('./userModel');

const cartSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true
    },
    quantity: {
      type: Number,
      default: 1
    },
      
    createdAt: {
      type: Date,
      default: Date.now
    }
  });

module.exports = mongoose.model('Cart', cartSchema);

