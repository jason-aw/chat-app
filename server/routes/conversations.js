const router = require('express').Router();
const User = require('../models/User');
const Conversation = require('../models/Conversation');
const { auth } = require('../middleware');

router.use(auth);

router.post('/add-contact', async (req, res) => {
    if (req.body.id === req.user.id) {
        res.status(403).json("can't add yourself");
    } else {
        try {
            const newContact = {
                id: req.body.id,
                name: req.body.name,
            };

            const user = await User.findOneAndUpdate({ id: req.user.id }, { $push: { contacts: newContact } });
            !user && res.status(404).json('user not found');

            res.status(200).json("add contact success");
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        };
    }
});

router.get('/get-contacts', async (req, res) => {
    try {
        const id = req.user.id;
        const query = await User.findOne({ id: id }).select('contacts');
        // !contacts && res.status(404).json('user not found');

        res.status(200).json(query.contacts);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.route('/create-conversation').post(async (req, res) => {
    const recipients = req.body.recipients;
    const newConversation = new Conversation({
        recipients: recipients
    });

    try {
        const conversation = await newConversation.save();
        res.status(201).json({ message: "Conversation created" });
    } catch (err) {
        res.status(500).json({ message: "Create conversation failed" + err.message });
    }
});

router.route('/get-conversations').get(async (req, res) => {
    try {

        const conversations = await Conversation.find({ recipients: req.user.id });
        // !conversations && res.status(404).json('conversation not found');
        // console.log('conversations');
        // console.log(conversations);
        res.status(200).json(conversations);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.route('/add-message').post(async (req, res) => {
    try {
        // console.log('incoming request');
        // console.log(req.body);
        const conversation = await Conversation.updateMany({ recipients: { $size: req.body.recipients.length, $all: req.body.recipients } },
            { "$push": { "messages": req.body.message } });
        !conversation && res.status(404).json('conversation not found');

        // console.log('result');
        // console.log(conversation);
        res.status(200).json('message add');
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;