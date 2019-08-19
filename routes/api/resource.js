const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const moment = require('moment');

const Task = require('../../models/Task');
const Resource = require('../../models/Resource');

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
    const today = moment().startOf('day');
    const query = {
      endDate: {
        $gte: moment(today)
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

// @route   POST api/resource
// @desc    Create a Resource
// @access  Private
router.post(
  '/',
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
      const newResource = new Resource({
        name: req.body.name,
        desc: req.body.desc,
        links: req.body.links
      });

      const resource = await newResource.save();
      console.log(resource);

      res.json(resource);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/resource
// @desc    Get resource by Id
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const resources = await Resource.find();
    res.json(resources);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/resource
// @desc    Get resource by Id
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    res.json(resource);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/resource/like/:id
// @desc    Like a resource
// @access  Private
router.put('/like/:id', auth, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    // Check if the resource has already been liked.
    if (
      resource.likes.filter((like) => like.user.toString() === req.user.id)
        .length > 0
    ) {
      return res.status(400).json({ msg: 'Resource already liked.' });
    }

    resource.likes.unshift({ user: req.user.id });

    await resource.save();

    console.log(resource);

    res.json(resource.likes);
  } catch (err) {
    console.log(err.message);

    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Resource not found' });
    }

    res.status(500).send('Server Error');
  }
});

// @route   GET api/resource/user/:id
// @desc    Retrieve resources liked by the user
// @access  Private
router.get('/user/:id', auth, async(req, res) => {
  try {

    const resources = await Resource.find();
    viewedResources = []

    resources.map(resource => {
      if (
        resource.likes.filter((like) => like.user.toString() === req.user.id)
          .length > 0
      ) {
        viewedResources.push(resource);
      }
    })

    res.json(viewedResources);
  } catch(err) {

  }
})

module.exports = router;
