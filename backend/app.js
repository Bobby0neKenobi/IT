const express = require('express');//entering express library

const Routes = require('./routes/routes');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.use('/admin', Routes)

app.listen(3000);