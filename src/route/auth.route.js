const express = require('express');
const router = express.Router();
const auth = require('../controller/auth.controller');
const authenticate = require('../middleware/auth.middleware');

router.post('/login', auth.login);

router.get('/logout', auth.logout);

router.get('/',authenticate.checkLogout,  auth.loginView);


module.exports = router;