const express = require('express');
const auth = require('./auth.route');
const profile = require('./profile.route');
const trainer = require('./trainer.route');
const trainee = require('./trainee.route');
const admin = require('./admin.route');
const staff = require('./staff.route');
const authenticate = require('../middleware/auth.middleware')
const router = express.Router();

router.use('/admin', authenticate.verifyUser, authenticate.isAdmin, admin);
router.use('/trainer', authenticate.verifyUser, authenticate.isTrainer, trainer);
router.use('/trainee', authenticate.verifyUser, authenticate.isTrainee, trainee);
router.use('/profile', authenticate.verifyUser, profile);
router.use('/staff', authenticate.verifyUser, authenticate.isStaff, staff);


router.use('/', auth);


module.exports = router;