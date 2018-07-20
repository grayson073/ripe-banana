const router = require('express').Router();
const Studio = require('../models/studio');
// const { updateOptions } = require('./_helpers');

module.exports = router

    .post('/', (req, res, next) => {
        Studio.create(req.body)
            .then(studio => res.json(studio))
            .catch(next);

    });