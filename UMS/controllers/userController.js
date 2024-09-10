const User = require('../models/userModel');
const nodeMailer = require('nodemailer');
const bcrypt = require('bcrypt');
const randomstring = require('randomstring');
const config = require('../config/config');
const Event = require('../models/eventModel');
const Post = require('../models/postModel');

const indexLoad = async (req, res) => {
    let musicEvents = [];
    let sportsEvents = [];
    let liveShowEvents = [];
    
    try {
        musicEvents = await Event.find({ category: 'Music' });
        console.log('Music Events fetched successfully');
    } catch (err) {
        console.error('Error fetching Music Events:', err.message);
    }
    
    try {
        sportsEvents = await Event.find({ category: 'Sport' });
        console.log('Sports Events fetched successfully');
    } catch (err) {
        console.error('Error fetching Sports Events:', err.message);
    }
    
    try {
        liveShowEvents = await Event.find({ category: 'Live Show' });
        console.log('Live Show Events fetched successfully');
    } catch (err) {
        console.error('Error fetching Live Show Events:', err.message);
    }

    // Render the view with the fetched events
    res.render('index', { musicEvents, sportsEvents, liveShowEvents });
};

// For sending mail
const sendVerifyMail = (name, email, id) => {
    try {
        const transporter = nodeMailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: config.emailUser,
                pass: config.emailPass 
            }
        });

        const mailOptions = {
            from: 'caelumz1121@gmail.com',
            to: email,
            subject: 'Account Verification',
            html: `<p>Hello ${name}, Please click on the link to verify your account: <a href="http://localhost:3000/verify/${id}"> Verify your account</p>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error:', error.message);
            } else {
                console.log('Email sent:', info.response);
            }
        });

    } catch (error) {
        console.log('Send Mail Error:', error.message);
    }
}

//for reset password send mail
const sendResetPasswordMail  = (name, email, token) => {
    try {
        const transporter = nodeMailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: config.emailUser,
                pass: config.emailPass 
            }
        });

        const mailOptions = {
            from: 'caelumz1121@gmail.com',
            to: email,
            subject: 'For Reset Password',
            html: `<p>Hello ${name}, Please click on the link to <a href="http://127.0.0.1:3000/forget-password?token=${token}"> Reset </a> your password.</p>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error:', error.message);
            } else {
                console.log('Email sent:', info.response);
            }
        });
        forgetPasswordLoad
    } catch (error) {
        console.log('Send Mail Error:', error.message);
    }
}

const loadRegister = (req, res) => {
    try {
        res.render('registration');
    } catch (error) {
        console.log('Load Register Error:', error.message);
    }
}

const insertUser = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            image: req.file.filename,
            password: hashedPassword,
            is_admin: req.body.is_admin || 0,
            is_verified: req.body.is_verified || 0 // Set default value if not provided
        });

        const userDatabase = await user.save();

        if (userDatabase) {
            sendVerifyMail(req.body.name, req.body.email, userDatabase._id); // Corrected from userData to userDatabase
            res.render('registration', { message: 'Your registration has been successful, Please verify your mail.' });
        } else {
            res.render('registration', { message: 'Your registration has failed!' });
        }

    } catch (error) {
        console.log('Insert User Error:', error.message);
        res.render('registration', { message: 'Error occurred during registration.' });
    }
};

const verifyMail = async (req, res) => {
    try {
        const updateInfo = await User.updateOne({ _id: req.params.id }, { $set: { is_verified: 1 } });

        console.log('Update Info:', updateInfo); 
        res.render('email-verified', { message: 'Your email has been verified successfully.' });
    } catch (error) {
        console.log('Verification Error:', error.message);
    }
};

const loadLogin = (req, res) => {
    try {
        res.render('login');
    } catch (error) {
        console.log('Load Login Error:', error.message);
    }
}


const verifyLogin = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const userDatabase = await User.findOne({ email: email });

        if (userDatabase) {
            console.log('is_verified:', userDatabase.is_verified); // Debugging

            const passwordMatch = await bcrypt.compare(password, userDatabase.password);
            if (passwordMatch) {
                if (userDatabase.is_verified === 0) {
                    
                    return res.render('login', { message: 'Please verify your email first.' });
                } else {
                    req.session.user_id = userDatabase._id;
                    return res.redirect('/home');
                }
            } else {
                return res.render('login', { message: 'Invalid email or password' });
            }
        } else {
            return res.render('login', { message: 'Invalid email or password' });
        }

    } catch (error) {
        console.log('Verify Login Error:', error.message);
        res.render('login', { message: 'Error occurred during login.' });
    }
};

const loadHome = async(req, res) => {
    let musicEvents = [];
    let sportsEvents = [];
    let liveShowEvents = [];
    
    try {
        musicEvents = await Event.find({ category: 'Music' });
        console.log('Music Events fetched successfully');
    } catch (err) {
        console.error('Error fetching Music Events:', err.message);
    }
    
    try {
        sportsEvents = await Event.find({ category: 'Sport' });
        console.log('Sports Events fetched successfully');
    } catch (err) {
        console.error('Error fetching Sports Events:', err.message);
    }
    
    try {
        liveShowEvents = await Event.find({ category: 'Live Show' });
        console.log('Live Show Events fetched successfully');
    } catch (err) {
        console.error('Error fetching Live Show Events:', err.message);
    }

    // Render the view with the fetched events
    res.render('home', { musicEvents, sportsEvents, liveShowEvents });
};


const loadProfile = async(req, res) => {
    try {
        const userData = await User.findById(req.session.user_id);
        console.log('User Data:', userData);
        if (!userData) {
            return res.redirect('/login'); // Redirect if user data is not found
        }
        res.render('profile', { user: userData });
    } catch (error) {
        console.log('Load Profile Error:', error.message);
    }
}

const userLogout = (req, res) => {
    try {
        req.session.destroy();
        res.redirect('/');
    } catch (error) {
        console.log('Logout Error:', error.message);
        
    }
}

//forget password code start
const forgetLoad = (req, res) => {
    try {
        res.render('forget');
    } catch (error) {
        console.log('Load Forget Error:', error.message);
    }
}

const forgetVerify = async (req, res) => {
    try {
        const email = req.body.email;
        const userData = await User.findOne({ email: email });
        if (userData) {
            if (userData.is_verified === 0) {
                res.render('forget', { message: 'Please verify your email first.' });
            } else {
                const randomString = randomstring.generate();
                await User.updateOne({ email: email }, { $set: { token: randomString } });
                sendResetPasswordMail(userData.name, email, randomString);
                res.render('forget', { message: 'Please check your email for the reset password link.' });
            }
        } else {
            res.render('forget', { message: 'Invalid email' });
        }
    } catch (error) {
        console.log('Forget Verify Error:', error.message);
    }
};

const forgetPasswordLoad = async (req, res) => {
    try {
        const token = req.query.token;
        const tokenData = await User.findOne({ token: token });

        if (tokenData) {
            console.log('Token Data:', tokenData); // Debugging
            res.render('forget-password', { user_id: tokenData._id }); // Pass user_id
        } else {
            res.render('404', { message: 'Invalid token' });
        }
    } catch (error) {
        console.log('Forget Password Load Error:', error.message);
        res.render('404', { message: 'An error occurred' });
    }
};


const resetPassword = async (req, res) => {
    try {
        const user_id = req.body.user_id;
        const password = req.body.password;
        const secure_Password = await bcrypt.hash(password, 10);
        const updatedData = await User.updateOne({ _id: user_id }, { $set: { password: secure_Password, token: '' } });
        if (updatedData.modifiedCount > 0) {
            res.render('forget-password', { message: 'Password has been reset successfully.' });
            // Redirect to login page
            res.redirect('/login');
        } else {
            res.render('forget-password', { message: 'Password reset failed.' });
        }
    } catch (error) {
        console.log('Reset Password Error:', error.message);
        res.render('forget-password', { message: 'An error occurred' });
    }
};


//user profile edit & update

const editLoad = async (req, res) => {
    try {
        const id = req.query.id;

        const userData = await User.findById({_id:id});
        
        if(userData){
            res.render('edit', { user: userData });
        }else{
            res.redirect('/login');
        }

    } catch (error) {
        console.log('Load Edit Error:', error.message);
    }
};

//update user profile
const updateProfile = async (req, res) => {
    try {
        console.log('Request Body:', req.body);
        console.log('Uploaded File:', req.file);

        if (!req.body.user_id) {
            console.log('User ID is missing');
            return res.status(400).send('User ID is required');
        }

        if (req.file) {
            const userData = await User.findByIdAndUpdate(
                req.body.user_id,
                { $set: { name: req.body.name, email: req.body.email, image: req.file.filename } },
                { new: true }
            );
            console.log('User Data with File:', userData);
        } else {
            const userData = await User.findByIdAndUpdate(
                req.body.user_id,
                { $set: { name: req.body.name, email: req.body.email } },
                { new: true }
            );
            console.log('User Data without File:', userData);
        }

        res.redirect('/home');
        
    } catch (error) {
        console.log('Update Profile Error:', error.message);
        res.status(500).send('An error occurred while updating profile.');
    }
};

const loadCreatePost = async (req, res) => {
    try {
        res.render('create-post');
    } catch (error) {
        console.log('Load Create Post Error:', error.message);
    }
}

const addPost = async (req, res) => {
    try {
        console.log('Title:', req.body.title); // Debugging
        console.log('Content:', req.body.content); // Debugging
        console.log('Image:', req.body.blogImg); // Debugging

        const post = new Post({
            title: req.body.title,
            content: req.body.content,
            image: req.body.blogImg, // Use the image path from the form
            user: req.session.user_id
        });

        const postDatabase = await post.save();

        if (postDatabase) {
            res.render('create-post', { message: 'Post added successfully.' });
        } else {
            res.render('create-post', { message: 'Post addition failed.' });
        }

    } catch (error) {
        console.log('Add Post Error:', error.message);
        res.render('create-post', { message: 'An error occurred while adding post.' });
    }
};


const uploadPostImage = async (req, res) => {
    try {
        console.log(req.file); // Add this line
        var imagePath = '/userImages/' + req.file.filename;

        res.json({ message: 'Image uploaded successfully!', path: imagePath });
    } catch (error) {
        console.error('Error uploading post image:', error.message);
        res.status(500).json({ message: 'Error occurred while uploading post image.' });
    }
};



module.exports = {
    indexLoad,
    loadHome,
    loadRegister,
    insertUser,
    verifyMail,
    loadLogin,
    verifyLogin,
    loadProfile,
    userLogout,
    forgetLoad,
    forgetVerify,
    forgetPasswordLoad,
    resetPassword,
    editLoad,
    updateProfile,
    loadCreatePost,
    addPost,
    uploadPostImage
};