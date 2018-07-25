const router = require('express').Router();
const Actor = require('../models/actor');
const Film = require('../models/film');
const { updateOptions } = require('./_helpers');
const ensureAuth = require('../util/ensure-auth')();
const ensureAdmin = require('../util/ensure-role')('admin');

module.exports = router

    .post('/', ensureAuth, ensureAdmin, (req, res, next) => {
        Actor.create(req.body)
            .then(actor => res.json(actor))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Actor.find()
            .lean()
            .select('name')
            .then(actors => res.json(actors))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        Promise.all([
            Actor.findById(req.params.id)
                .lean()
                .select('name dob pob'),
            Film
                .find()
                .lean()
                .select('title released')
        ])
            .then(([actor, films]) => {
                if(!actor) {
                    console.log('Actor not found');
                } else {
                    actor.films = films;
                    res.json(actor);
                }
            })
            .catch(next);
    })

    .put('/:id', ensureAuth, ensureAdmin, (req, res, next) => {
        Actor.findByIdAndUpdate(
            req.params.id,
            req.body,
            updateOptions
        )
            .select('name dob pob')
            .then(actor => res.json(actor))
            .catch(next);
    })

    .delete('/:id', ensureAuth, ensureAdmin, (req, res, next) => {
        Film
            .find({ 'cast.actor': req.params.id })
            .then((films) => {
                if(films.length > 0){
                    res.json({ removed: false });
                } else {
                    Actor.findByIdAndRemove(req.params.id)
                        .then(actor => res.json({ removed: !!actor }));
                }
            })
            .catch(next);
    });
