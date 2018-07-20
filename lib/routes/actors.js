const router = require('express').Router();
const Actor = require('../models/actor');
const { updateOptions } = require('./_helpers');

module.exports = router

    .post('/', (req, res, next) => {
        Actor.create(req.body)
            .then(actor => res.json(actor))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Actor.find()
            .lean()
            .select()
            .then(actors => res.json(actors))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        Actor.findById(req.params.id)
            .lean()
            .select()
            .then(actor => res.json(actor))
            .catch(next);
    })

    .put('/:id', (req, res, next) => {
        Actor.findByIdAndUpdate(
            req.params.id,
            req.body,
            updateOptions
        )
            .then(actor => res.json(actor))
            .catch(next);
    });
