const mongoose = require('mongoose');
const User = require('./userModel');

const commentSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comment: { 
        type: String,
        required: true 
    },
    createdAt: { 
        type: Number,
        default: Date.now 
    }
});


const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Number,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    comments: [commentSchema], // Use embedded schema
});

module.exports = mongoose.model('Post', postSchema);
