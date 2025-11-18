const express = require('express');
const router = express.Router();
const { getSignup, getSignin, getDashboard, postRegister, postLogin } = require('../controllers/users.contoller');

const User = require('../models/user.models')

router.get("/signup", getSignup)

router.post('/register', postRegister)

router.get("/signin", getSignin)

router.post('/login', postLogin);


router.get("/dashboard", getDashboard)

module.exports = router;