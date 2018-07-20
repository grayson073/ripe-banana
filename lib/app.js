const express = require('express');
const app = express();
const morgan = require('morgan');

app.use(morgan('dev'));
app.use(express.json());

const actors = require('./routes/actors');
const studio = require('./routes/studios');
const reviewers = require('./routes/reviewers');

app.use('/api/actors', actors);
app.use('/api/studios', studio);
app.use('/api/reviewers', reviewers);

module.exports = app;