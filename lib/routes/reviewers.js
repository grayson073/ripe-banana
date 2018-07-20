const router = require('express').Router();
const Reviewer = require('../models/reviewer');
const { updateOptions } = require('./_helpers');

module.exports = router

    .post('/', (req, res, next) => {
        Reviewer.create(req.body)
            .then(reviewer => res.json(reviewer))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Reviewer.find()
            .lean()
            .then(reviewers => res.json(reviewers))
            .catch(next)
    })