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
<<<<<<< HEAD

server.listen(3000);
=======
app.use(express.static('../frontend'))
app.listen(3000);
>>>>>>> 9b1558bc2c7ef7d0be82daf6e885d14e2c6ba119
