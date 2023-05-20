import path from 'path';
import express from 'express';
import configViewEngine from './configs/viewEngine';
import initWebRouter from './route/web';
import connection from './configs/connectDB';
import { config } from 'dotenv';
import initApiRouter from './route/api'
///


// import https from 'https';
// import fs from 'fs';
// const options = {
//     key: fs.readFileSync(path.join(__dirname, 'ssl', 'key.pem')),
//     cert: fs.readFileSync(path.join(__dirname, 'ssl', 'cert.pem'))
// };


//


var cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config();
const port = process.env.PORT || 8000;
const app = express();
app.use(bodyParser.urlencoded({
    extended: true,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE'
}))
app.use(bodyParser.json())
app.use(cors())
configViewEngine(app);
initWebRouter(app);
initApiRouter(app);
app.listen(port, () => {
    console.log(`Running on port ${port}`)
})




///
// Tạo HTTPS server với đối tượng options
// const server = https.createServer(options, app);