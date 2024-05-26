const express = require('express');

const router = express.Router();
const UserData = require('../controller/user');
const ScoreData = require('../controller/score');

router.get('/user', UserData.getUserData);

router.post('/user', UserData.postUserData);

router.put('/user', UserData.putUserData);

router.get('/score', ScoreData.getScore);

router.post('/score', ScoreData.postScore);

module.exports = router;