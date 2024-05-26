const express = require('express');
const https = require('https');
const fs = require('fs');
const cors = require('cors');

const Routes = require('./routes/routes');
const app = express();
const bodyParser = require('body-parser');

const httpsOptions = {
    key: fs.readFileSync('./cert/server.key'),
    cert: fs.readFileSync('./cert/server.cert')
};

const server = https.createServer(httpsOptions, app);  

app.use(cors());

app.use(bodyParser.json());

app.use('/admin', Routes)
app.use(express.static('../frontend'))
app.listen(3000);
