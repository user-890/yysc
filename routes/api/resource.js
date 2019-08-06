const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const moment = require('moment');

const Task = require('../../models/Task');

// @route   POST api/resource/task
// @desc    Create a Task
// @access  Private
router.post(
  '/task',
  [
    auth,
    [
      check('desc', 'A description is required')
        .not()
        .isEmpty(),
      check('name', 'A name is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const newTask = new Task({
        name: req.body.name,
        desc: req.body.desc,
        startDate: req.body.startDate,
        endDate: req.body.endDate
      });

      const task = await newTask.save();
      console.log(task);

      res.json(task);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/resource/task
// @desc    Get all daily tasks
// @access  Private
router.get('/task', auth, async (req, res) => {
  try {
    const query = {
      startDate: {
        $lte: moment(moment().startOf('day'))
          .endOf('day')
          .toDate()
      }
    };

    const tasks = await Task.find(query).sort({ startDate: -1 });
    res.json(tasks);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
