require('dotenv').config( {path: './config.env'} );
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const connectDB = require('../config/db');
const errorhandler = require('../middleware/error');

connectDB();

const routesAuthJs = require('../routes/auth');
const privateRoutesAuthJs = require('../routes/private');

const express = require('express');

const app = express();

app.use(morgan('common'));
app.use(helmet());
app.use(cors( {origin: 'http:/localhost:3000'} ));
app.use(express.json());

app.use('/api/auth', routesAuthJs);
app.use('/api/private', privateRoutesAuthJs);

//Error Handler should always be the last middleware
app.use(errorhandler);


const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => { console.log(`running on port http://localhost:${PORT}` )});

process.on('unhandledRejection', (err, promise) => {
    console.log(`Logged error: ${err}`);
    server.close( () => process.exit(1) );
});

