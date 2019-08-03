const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

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

        console.log("In api...");

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

module.exports = router;