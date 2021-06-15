// auth middleware
// only allow logged in users to pass
function auth(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.json({
            isAuth: false,
            error: true
        });
    }
}

// guest middleware
// only allow guests to pass
function guest(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    } else {
        res.json({
            isAuth: true,
            error: true
        });
    }
}

module.exports = { auth, guest };