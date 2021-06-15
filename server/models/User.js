const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        minglength: 5
    },
    contacts: [{
        id: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        }
    }],
    tokens: Array
}, { timestamps: true });

// before save to db, rehash password if changed
userSchema.pre('save', function (next) {
    var user = this;

    if (user.isModified('password')) {
        bcrypt.hash(user.password, 10, (err, hash) => {
            if (err) return next(err);
            user.password = hash;
            next();
        })
    } else {
        next();
    }
})

userSchema.methods.comparePassword = function (plainPassword, callback) {
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if (err) return callback(err);
        callback(null, isMatch)
    })
}

module.exports = mongoose.model('User', userSchema);