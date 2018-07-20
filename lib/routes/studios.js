const router = require('express').Router();
const Studio = require('../models/studio');
// const { updateOptions } = require('./_helpers');

module.exports = router

    .post('/', (req, res, next) => {
        Studio.create(req.body)
            .then(studio => res.json(studio))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Studio.find()
            .lean()
            .then(studios => res.json(studios))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        Studio.findById(req.params.id)
            .lean()
            .select()
            .then(studio => res.json(studio))
            .catch(next);
    })