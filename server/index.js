const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const socketio = require('socket.io');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/User');
const Conversation = require('./models/Conversation');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const CLIENT_ENDPOINT = process.env.CLIENT_ENDPOINT || 'http://localhost:3000';
const PORT = process.env.PORT || 5000;
const DB_URI = process.env.DB_URI;
const COOKIE_SECRET = process.env.COOKIE_SECRET || 'mysecret';

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: CLIENT_ENDPOINT,
});

/* MIDDLEWARE */

app.use(cors({
    origin: CLIENT_ENDPOINT,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(session({
    secret: COOKIE_SECRET,
    saveUninitialized: false,
    resave: false,
    store: MongoStore.create({
        mongoUrl: process.env.DB_URI,
        ttl: 6 * 60 * 60,
        autoRemove: 'native'
    })
}));

/* PASSPORT.JS */

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, (email, password, done) => {
    User.findOne({ email: email.toLowerCase() }, (err, user) => {
        if (err) { return done(err); }
        if (!user) {
            return done(null, false, { message: `Email ${email} not found.` });
        }

        user.comparePassword(password, (err, isMatch) => {
            if (err) { return done(err); }
            if (isMatch) {
                // user found with correct password
                return done(null, user);
            }
            // incorrect credentials
            return done(null, false, { message: 'Invalid email or password.' });
        });
    });
}));

/* SOCKET.IO */

io.on('connection', socket => {
    const id = socket.handshake.query.id;
    socket.join(id);

    socket.on('send-message', async ({ recipients, sender, text }) => {
        const message = {
            sender: sender,
            text: text
        };
        try {
            const conv = await Conversation.updateMany({ recipients: { $size: recipients.length, $all: recipients } },
                { "$push": { "messages": message } });
        } catch (err) {
            console.log(err);
        }

        recipients.forEach(recipient => {
            socket.broadcast.to(recipient).emit('receive-message');
        });
    });
});

/* ROUTES */
app.use('/api/users', require('./routes/users'));
app.use('/api/conversations', require('./routes/conversations'));

app.get('/', (req, res) => {
    res.send('Server is running');
});

/* MONGODB AND LISTEN */
mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
    .then(() => server.listen(PORT, () => console.log(`Server running on: http://localhost:${PORT}`)))
    .catch((error) => console.log(`${error} did not connect`));