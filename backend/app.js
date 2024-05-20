const express = require('express');//entering express library

const userRoutes = require('./routes/user');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.use('/admin', userRoutes)

app.listen(3000);