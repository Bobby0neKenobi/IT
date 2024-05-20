const express = require('express');

const router = express.Router();
const UserData = require('../controller/user')

router.get('/user', UserData.getUserData);

router.post('/user', UserData.postUserData);

router.put('/user', UserData.putUserData);

module.exports = router;