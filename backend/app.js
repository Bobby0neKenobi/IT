const express = require('express');//entering express library
const cors = require('cors');

const Routes = require('./routes/routes');
const app = express();
const bodyParser = require('body-parser');

app.use(cors());

app.use(bodyParser.json());

app.use('/admin', Routes)

app.listen(3000);