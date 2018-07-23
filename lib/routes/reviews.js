const router = require('express').Router();
const Review = require('../models/review');
const { updateOptions } = require('./_helpers');

module.exports = router

    .post('/', (req, res, next) => {
        Review.create(req.body)
            .then(review => res.json(review))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Review.find()
            .lean()
            .select('rating review')
            .limit(100)
            .populate({
                path: 'film',
                select: 'title'
            })
            .then(reviews => res.json(reviews))
            .catch(next);
    })

    .put('/:id', (req, res, next) => {
        Review.findByIdAndUpdate(
            req.params.id,
            req.body,
            updateOptions
        )
            .select('rating review')
            .then(review => res.json(review))
            .catch(next);
    });
