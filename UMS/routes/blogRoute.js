const express = require('express');
const post_route = express.Router();
const session = require('express-session');
const config = require('../config/config');
post_route.use(session({ secret: config.sessionSecret}));

const auth = require('../middleware/auth');

post_route.use(express.static('public'));

const blogController = require('../controllers/blogController');

// Route for loading all posts
post_route.get('/', blogController.loadBlog);

// Route for loading a single post by ID
post_route.get('/:id', blogController.loadPost);

post_route.post('/add-comment', auth.isLogin, blogController.addComment);

module.exports = post_route;
