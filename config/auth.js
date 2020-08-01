const ensureAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }
    req.flash('error_msg', 'Please Log in into this views');
    res.redirect('users/login');
}

module.exports = ensureAuth;