const express = require('express');
const user_route = express.Router();
const multer = require('multer');
const path = require('path');
const userController = require('../controllers/userController');
const session = require('express-session');

const config = require('../config/config');

user_route.use(session({ secret: config.sessionSecret}));

const auth = require('../middleware/auth');

const bodyParser = require('body-parser');
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({ extended: true }));

user_route.use(express.static(path.join(__dirname, '../public')));
// Multer configuration for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/userImages'));
    },
    filename: function (req, file, cb) {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
});


const upload = multer({ storage: storage });

// Route definitions
user_route.get('/', auth.isLogout, userController.indexLoad);

user_route.get('/home', auth.isLogin, userController.loadHome);

user_route.get('/profile', auth.isLogin,userController.loadProfile);

user_route.get('/register', auth.isLogout, userController.loadRegister);

user_route.post('/register', upload.single('image'), userController.insertUser);

user_route.get('/verify/:id', userController.verifyMail);

user_route.get('/login', auth.isLogout, userController.loadLogin);

user_route.post('/login', userController.verifyLogin);

user_route.get('/home', auth.isLogin, userController.loadHome);

user_route.get('/logout', auth.isLogin, userController.userLogout);

user_route.get('/forget', auth.isLogout, userController.forgetLoad);

user_route.post('/forget', userController.forgetVerify);

user_route.get('/forget-password', auth.isLogout, userController.forgetPasswordLoad);

user_route.post('/forget-password', userController.resetPassword);

user_route.get('/edit', auth.isLogin, userController.editLoad);

user_route.post('/edit', upload.single('image'), userController.updateProfile);

user_route.get('/create-post', auth.isLogin, userController.loadCreatePost);

user_route.post('/create-post', auth.isLogin, userController.addPost);

user_route.post('/upload-post-image', upload.single('blogImg'), auth.isLogin, userController.uploadPostImage);

module.exports = user_route; 

