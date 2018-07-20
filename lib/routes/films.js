const router = require('express').Router();
const Film = require('../models/film');
const { updateOptions } = require('./_helpers');

module.exports = router

    .post('/', (req, res, next) => {
        Film.create(req.body)
            .then(film => res.json(film))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Film.find()
            .lean()
            .then(films => res.json(films))
            .catch(next);
    });