const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const Event = require('../../models/Event');

// @route   POST api/log/page-view
// @desc    Create a logging event
// @access  Private
router.post('/page-view', auth, async (req, res) => {
  try {
    const category = req.body.category;
    const action = req.body.action;
    const payload = req.body.payload;

    const newEvent = new Event({
      category: category,
      action: action, 
      date: new Date(),
      payload: payload,
      user: req.user.id
    });

    const event = await newEvent.save();
    
    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/log
// @desc    Get all logs
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
      const logs = await Event.find().sort({ date: -1 });
      res.json(logs);
  } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
  }
});

module.exports = router;
