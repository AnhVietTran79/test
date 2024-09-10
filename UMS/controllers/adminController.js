const User = require("../models/userModel");
const bcrypt = require('bcrypt');
const randomstring = require('randomstring');
const config = require("../config/config");
const nodeMailer = require('nodemailer');

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
            html: `<p>Hello ${name}, Please click on the link to <a href="http://127.0.0.1:3000/admin/forget-password?token=${token}"> Reset </a> your password.</p>`
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

const securePassword = async(password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (error) {
        console.log(error.message);
    }
}

const loadLogin = async(req, res) => {
    try {
        res.render('login');
    } catch (error) {
        console.log(error.message);
    }
}

const verifyLogin = async(req, res) => {
    try {

        const email = req.body.email;
        const password = req.body.password;
        const userDatabase = await User.findOne({ email: email });

        if (userDatabase) {
            const passwordMatch = await bcrypt.compare(password, userDatabase.password);

            if (passwordMatch) {

                if (userDatabase.is_admin === 0) {
                    res.render('login', { message: 'Invalid email or password'})
                } else {
                    req.session.user_id = userDatabase._id;
                    res.redirect('/admin/home');
                }

            } else {
                res.render('login', { message: 'Invalid email or password' });
            }
        } else {
            res.render('login', { message: 'Invalid email or password' });
        }

    } catch (error) {
        console.log(error.message);
    }
}

const loadDashboard = async(req, res) => {
    try {
        const userDatabase = await User.findById({_id: req.session.user_id});
        res.render('home', {admin: userDatabase});
    } catch (error) {
        console.log(error.message);
    }
}

const adminDashboard = async(req, res) => {
    try {
        const userDatabase = await User.find({is_admin:0});
        res.render('dashboard', {users: userDatabase});
    } catch(error){
        console.log(error.message);
    }
}

const logout = async(req,res) => {
    try {
        req.session.destroy();
        res.redirect('/admin');
    } catch (error) {
        console.log(error.message);
    }
}

const forgetLoad = async(req, res) => {
    try {
        res.render('forget');
    } catch (error) {
        console.log(error.message);
    }
}

const forgetVerify = async(req,res) => {
    try {
        const email = req.body.email;
        const userDatabase = await User.findOne({email: email});
        if (userDatabase) {
            if (userDatabase.is_admin === 0) {
                res.render('forget', {message:'Invalid email address'});
            } else {
                const randStr = randomstring.generate();
                const updateData = await User.updateOne({email: email}, {$set: {token: randStr}});
                sendResetPasswordMail(userDatabase.name, userDatabase.email, randStr);
                res.render('forget', {message:'Please check your email to reset password.'});
            }

        } else {
            res.render('forget', {message:'Invalid email address'});
        }
        
    } catch(error) {
        console.log(error.message);
    }
}

const forgetPasswordLoad = async(req,res) => {
    try {
        const token = req.query.token;

        const tokenData = await User.findOne({token: token});
        if (tokenData) {
            res.render('forget-password', {user_id:tokenData._id});
        } else {
            res.render('404', {message: "Invalid Link."});
        }
    } catch (error) {
        console.log(error.message);
    }
}

const resetPassword = async(req,res) => {
    try {
        const password = req.body.password;
        const user_id = req.body.user_id;

        const secured = await securePassword(password);
        const updatedData = await User.findByIdAndUpdate({ _id: user_id }, {$set: {password: secured}, token: ''});

        res.redirect('/admin');
    } catch (error) {
        console.log(error.message);
    }
}

const editUserLoad = async(req, res) => {
    try {
        const id = req.query.id;
        const userDatabase = await User.findById({_id: id});
        if (userDatabase)  {
            res.render('edit-user', {users: userDatabase});
        } else {
            res.redirect('/admin/dashboard');
        }
    } catch (error) {
        console.log(error.message);
    }
}

const editUserUpdate = async(req, res) => {
    try {
        const userDatabase = await User.findByIdAndUpdate({_id: req.body.user_id}, {
            $set: {
                is_verified: req.body.is_verified
            }});
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    loadLogin,
    verifyLogin,
    loadDashboard,
    logout,
    forgetLoad,
    forgetVerify,
    forgetPasswordLoad,
    resetPassword,
    adminDashboard,
    editUserLoad,
    editUserUpdate
}