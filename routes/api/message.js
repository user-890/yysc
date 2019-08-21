const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const Conversation = require('../../models/Conversation');
const Message = require('../../models/Message');
const User = require('../../models/User');

// @route   POST api/message/channel
// @desc    Add a new channel
// @access  Private
router.post('/channel', auth, async (req, res) => {
  try {
    const recipient = req.body.recipient;

    const username = await User.findOne({ _id: req.user.id }, { name: 1 });
    const foundRecipient = await User.findOne({ name: recipient }, { name: 1 });

    const newConversation = new Conversation({
      participants: [req.user.id, foundRecipient._id],
      channelName: foundRecipient.name
    });

    await newConversation.save();

    res.json(newConversation);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/message/channels
// @desc    Add a new channel
// @access  Private
router.get('/channels', auth, async (req, res) => {
  try {
    // Get the current user's username
    const username = await User.findOne({ _id: req.user.id });
    const conversations = await Conversation.find({
      participants: req.user.id
    });

    const conversationArray = [];
    for (conversation of conversations) {
      console.log(conversation);
      conversationArray.push(conversation);
    }

    res.json(conversationArray);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/message/conversation
// @desc    Get conversations
// @access  Private
router.get('/conversation', auth, async (req, res) => {
  try {
    // Get the current user's username
    channel = JSON.parse(req.query.channel);

    const messages = await Message.find({ conversationId: channel._id }).sort(
      '-timestamp'
    );

    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/message/conversation
// @desc    Post to a conversation
// @access  Private
router.post('/conversation', auth, async (req, res) => {
  try {
    const channel = req.body.channel;

    const newMessage = new Message({
      conversationId: channel._id,
      user: req.user.id,
      body: req.body.message
    });

    await newMessage.save();

    res.json(newMessage);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
