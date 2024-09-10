const express = require("express");
const admin_route = express();

const session = require("express-session");
const config = require("../config/config");
admin_route.use(session({ secret: config.sessionSecret}));

const bodyParser = require("body-parser");
admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({ extended: true }));

admin_route.set('view engine', 'ejs');
admin_route.set('views', './views/admin');

const adminController = require("../controllers/adminController.js");

const authenticate = require("../middleware/adminAuth.js");

admin_route.get('/', authenticate.isLogout, adminController.loadLogin);

admin_route.post('/login', adminController.verifyLogin);

admin_route.get('/home', authenticate.isLogin, adminController.loadDashboard);

admin_route.get('/logout', authenticate.isLogin, adminController.logout);

admin_route.get('/forget', authenticate.isLogout, adminController.forgetLoad);
admin_route.post('/forget', adminController.forgetVerify);

admin_route.get('/forget-password', authenticate.isLogout, adminController.forgetPasswordLoad);
admin_route.post('/forget-password', adminController.resetPassword);

admin_route.get('/dashboard', authenticate.isLogin, adminController.adminDashboard);

admin_route.get('/edit-user', authenticate.isLogin, adminController.editUserLoad);
admin_route.post('/edit-user', adminController.editUserUpdate);

admin_route.get('*', function(req,res){
    res.redirect('/admin');
})

module.exports = admin_route;