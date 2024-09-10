const Post = require('../models/postModel');
const mongoose = require('mongoose');
const config = require('../config/config');
const session = require('express-session');

// Load all posts
const loadBlog = async (req, res) => {
    try {
        const posts = await Post.find().populate({ path: 'user', select: 'name image' });
        res.render('blog', { posts: posts });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Load a single post by ID
const loadPost = async (req, res) => {
    try {
        const post = await Post.findOne({"_id": req.params.id}).populate({ path: 'comments.user', select: 'name image' });
        console.log(post);
        
        if (!post) {
            return res.status(404).send('Post not found');
        }
        res.render('post', { post: post }); // Assuming you have a view for a single post
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addComment = async (req, res) => {
    try {
        const postId = req.body.post_id;
        const commentText = req.body.comment;

        // Check if user is logged in
        if (!req.session.user_id) {
            return res.status(401).json({ message: 'User not logged in' });
        }

        console.log('User ID from session:', req.session.user_id); // Debugging

        // Validate post ID
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Invalid Post ID' });
        }

        // Find the post by ID
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Add comment with user ID
        post.comments.push({
            comment: commentText,
            user: req.session.user_id // Store the user ID from the session
        });

        // Save the post with the new comment
        await post.save();

        res.json({ message: 'Comment added successfully!' });
    } catch (error) {
        console.error('Error adding comment:', error.message);
        res.status(500).json({ message: 'Error occurred while adding comment.' });
    }
};


module.exports = { 
    loadBlog,
    loadPost,
    addComment
};
