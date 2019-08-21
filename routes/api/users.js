const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const { uniqueNamesGenerator } = require('unique-names-generator');
const auth = require('../../middleware/auth');

const User = require('../../models/User');


// @route   POST api/users
// @desc    Register user
// @access  Public
router.post(
  '/',
  [
    check('email', 'Email is required').isEmail(),
    check(
      'password',
      'Please enter a passowrd that is 6 or more characters long.'
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    console.log(req.body);

    const { email, password, admin, adminCode } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      if (admin && adminCode !== 'yysc2019') {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Incorrect admin code' }] });
      }

      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      });

      const name = uniqueNamesGenerator();

      user = new User({
        name,
        email,
        avatar,
        password,
        admin
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 3600000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET api/user
// @desc    Get all users
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find().sort({ date: 1 });
    res.json(users);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
