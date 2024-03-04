const express = require('express');
const router = express.Router();
const profile = require('../controller/profile.controller');
const upload = require('../middleware/user.middleware');


router.get('/changePassword', profile.viewChangePassword);
router.patch('/changepassword', profile.changePassword);
router.patch('/trainee/update',upload.single('avatar'), profile.updateTrainee);
router.put('/update',upload.single('avatar'), profile.updateAll);
router.get('/viewUpdate', profile.viewUpdate);
router.get('/', profile.show);

module.exports = router;

