const express = require('express');
const app = express();
const morgan = require('morgan');

app.use(morgan('dev'));
app.use(express.json());

const actors = require('./routes/actors');

app.use('/api/actors', actors);

module.exports = app;