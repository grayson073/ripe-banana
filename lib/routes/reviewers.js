const router = require('express').Router();
const Reviewer = require('../models/reviewer');
const Review = require('../models/review');
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
            .select('name company email hash roles')
            .then(reviewers => res.json(reviewers))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        Promise.all([
            Reviewer.findById(req.params.id)
                .lean()
                .select('name company email hash roles'),
            Review.find({ reviewer: req.params.id })
                .lean()
                .populate({
                    path: 'film',
                    select: 'title'
                })
                .select('rating review'),
        ])
            .then(([reviewer, reviews]) => {
                if(!reviewer) {
                    console.log('Reviewer not found');
                } else {
                    reviewer.reviews = reviews;
                    res.json(reviewer);
                }
            })
            .catch(next);
    })

    .put('/:id', (req, res, next) => {
        Reviewer.findByIdAndUpdate(
            req.params.id,
            req.body,
            updateOptions
        )
            .select('name company email hash roles')
            .then(reviewer => res.json(reviewer))
            .catch(next);
    });