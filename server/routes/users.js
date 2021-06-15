const router = require('express').Router();
const User = require('../models/User');
const passport = require('passport');
const { auth, guest } = require('../middleware');
const { v4: uuidv4 } = require('uuid');
// returns current user
router.get('/auth', auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        isAuth: true
    });
});

router.post('/register', guest, async (req, res) => {
    try {
        const existUser = await User.findOne({ email: req.body.email });
        // console.log(existUser);
        if (existUser) {
            return res.status(400).json({ error: "Email has been registered" });
        }

        const user = new User({
            email: req.body.email,
            password: req.body.password,
            id: uuidv4()
        });
        await user.save()
        return res.status(200).json({ success: "Register success" });
    } catch (err) {
        console.log(err);
    }

});

router.post('/login', guest, (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            return next(err);
        }

        if (!user) {
            // console.log('no user');
            return res.json({ msg: info });
        }

        req.logIn(user, function (err) {
            if (err) { return next(err); }
            // console.log('login success');
            return res.status(200).json({ loginSuccess: true })
        });
    })(req, res, next);
});

router.get("/logout", auth, (req, res) => {
    req.logout();
    req.session.destroy(function () {
        res.clearCookie('connect.sid', { path: '/' }).status(200).send({ isAuth: false });
    });
});

module.exports = router;