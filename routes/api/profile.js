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

    console.log(profile);

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
