module.exports = {
    isLogin: (req, res, next) => {
        if (req.session.user_id) {
            next();
        } else {
            res.redirect('/login');
        }
    },
    isLogout: (req, res, next) => {
        if (!req.session.user_id) {
            next();
        } else {
            res.redirect('/home');
        }
    }
};
