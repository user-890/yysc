const express = require('express');
const config = require('config');
const router = express.Router();
const auth = require('../../middleware/auth');

const User = require('../../models/User');

// @route   GET api/profile/me
// @desc    Retrieve current user's profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await User.findById(req.user.id)
      .select('-password')
      .select('-email');

    if (!profile) {
      return res
        .status(400)
        .json({ msg: 'There is not profile for this user' });
    }

    return res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

// @route   GET api/profile
// @desc    Retrieve all profiles
// @access  Private
router.get('/', async (req, res) => {
  try {
    const profiles = await User.find()
      .select('-password')
      .select('-email');

    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await User.findById(req.params.user_id)
      .select('-password')
      .select('-email');

    if (!profile) return res.status(400).json({ msg: 'Profile not found.' });

    res.json(profile);
  } catch (err) {
    console.error(err.message);

    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found.' });
    }

    res.status(500).send('Server Error');
  }
});
