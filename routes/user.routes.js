const express = require('express');
const { getUser } = require('../controllers/user.controller');
const { isAuth } = require('../utils/authenication');

const router = express.Router();

router.get('/user',  isAuth, getUser);

module.exports = router;