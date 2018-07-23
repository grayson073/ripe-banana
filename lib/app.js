const express = require('express');
const app = express();
app.use(express.json());

const actors = require('./routes/actors');
const studios = require('./routes/studios');
const reviewers = require('./routes/reviewers');
const films = require('./routes/films');
const reviews = require('./routes/reviews');

app.use('/api/actors', actors);
app.use('/api/studios', studios);
app.use('/api/reviewers', reviewers);
app.use('/api/films', films);
app.use('/api/reviews', reviews);

module.exports = app;