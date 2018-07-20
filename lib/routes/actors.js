const router = require('express').Router();
const Actor = require('../models/actor');

module.exports = router
    .get('/', (req, res, next) => {
        Actor.find(req.query)
            .lean()
            .select()
            .then(tours => res.json(tours))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        Actor.find(req.query)
            .lean()
            .select()
            .then(tours => res.json(tours))
            .catch(next);
    });
