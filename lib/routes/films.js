const router = require('express').Router();
const Film = require('../models/film');
const Review = require('../models/review');
// const { updateOptions } = require('./_helpers');

module.exports = router

    .post('/', (req, res, next) => {
        Film.create(req.body)
            .then(film => res.json(film))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Film.find()
            .lean()
            .select('title released')
            .populate({
                path: 'studio',
                select: 'name'
            })
            .then(films => res.json(films))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        Promise.all([
            Film.findById(req.params.id)
                .lean()
                .select('title released cast.role')
                .populate({
                    path: 'studio',
                    select: 'name'
                })
                .populate({
                    path: 'cast.actor',
                    select: 'name'
                }),

            Review.find({ film: req.params.id })
                .lean()
                .populate({
                    path: 'reviewer',
                    select: 'name'
                })
                .select('rating review reviewer')
        ])
            .then(([film, reviews]) => {
                if(!film) {
                    console.log('film not found');
                } else {
                    film.reviews = reviews;
                    res.json(film);
                }
            })
            .catch(next);
    });

  