const mongoose = require('mongoose');

const conversationSchema = mongoose.Schema({
    "recipients": [{
        "type": String,
        "required": true
    }],
    "messages": [{
        "sender": {
            "type": String,
            "required": true,
        },
        "text": {
            "type": String,
            "required": true,
        }
    }]
}, { "timestamps": true });

module.exports = mongoose.model('Conversation', conversationSchema);