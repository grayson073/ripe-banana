const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { checkOk } = request;

describe.only('Films API', () => {

    beforeEach(() => dropCollection('films'));
    beforeEach(() => dropCollection('studios'));
    beforeEach(() => dropCollection('actors'));

    function saveReview(review) {
        return request
            .post('/api/reviews')
            .send(review)
            .then(checkOk)
            .then(({ body }) => {
                delete body.__v;
                return body;
            });
    }

    function saveReviewer(reviewer) {
        return request
            .post('/api/reviewers')
            .send(reviewer)
            .then(checkOk)
            .then(({ body }) => {
                delete body.__v;
                return body;
            });
    }

    function saveFilm(film) {
        return request
            .post('/api/films')
            .send(film)
            .then(checkOk)
            .then(({ body }) => {
                delete body.__v;
                return body;
            });
    }

    function saveStudio(studio) {
        return request
            .post('/api/studios')
            .send(studio)
            .then(checkOk)
            .then(({ body }) => {
                delete body.__v;
                return body;
            });
    }

    function saveActor(actor) {
        return request
            .post('/api/actors')
            .send(actor)
            .then(checkOk)
            .then(({ body }) => {
                delete body.__v;
                return body;
            });
    }

    let ebert;
    beforeEach(() => {
        return saveReviewer({
            name: 'Roger Ebert',
            company: 'Ebert Reviews'
        })
            .then(data => {
                ebert = data;
            });
    });
    
    let fox;
    beforeEach(() => {
        return saveStudio({
            name: 'Fox'
        })
            .then(data => {
                fox = data;
            });
    });
    
    let rock; 
    beforeEach(() => {
        return saveActor({
            name: 'The Rock'
        })
            .then(data => {
                rock = data;
            });       
    });

    let scarface;
    beforeEach(() => {
        return saveFilm({
            title: 'Scarface',
            studio: fox._id,
            released: 2015,
            cast: [{
                role: 'Tony Montana',
                actor: rock._id
            }]
        })
            .then(data => {
                scarface = data;
            });
    });



    let review1;
    beforeEach(() => {
        return saveReview({
            rating: 5,
            reviewer: ebert._id,
            review: 'this is good',
            film: scarface._id,
        })
            .then(data => {
                review1 = data;
            });
    });

    it('Saves a film', () => {
        assert.isOk(scarface._id);
    });

    const makeFilm = (film, studio) => {
        const combined = {
            _id: film._id,
            title: film.title,
            released: film.released
        };
        combined.studio = {
            _id: studio._id,
            name: studio.name
        };
        return combined;

    } ;


    it('Gets a list of films', () => {
        let topGun;
        return saveFilm({ 
            title: 'Top Gun',
            released: 1986,  
            studio: fox._id,
        })
            .then(data => {
                topGun = data;
                return request.get('/api/films');
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [
                    makeFilm(scarface, fox),
                    makeFilm(topGun, fox)
                ]);
            });
    });


    const makeFilm2 = (film, studio, actor, review, reviewer) => {
        const combined = {
            _id: film._id,
            title: film.title,
            released: film.released,
        };
        
        combined.studio = {
            _id: studio._id,
            name: studio.name
        };
        
        combined.cast = [{
            actor: {
                _id: actor._id,
                name: actor.name
            },  
            role: film.cast[0].role
        }];

        combined.reviews = [{
            _id: review._id,
            rating: review.rating,
            review: review.review,

            reviewer: {
                _id: reviewer._id,
                name: reviewer.name
            }
        }];

        return combined;

    } ;

    it('Gets a film by id', () => {
        return request
            .get(`/api/films/${scarface._id}`)
            .then(({ body }) => {
                assert.deepEqual(body, 
                    makeFilm2(scarface, fox, rock, review1, ebert)
                );
            });
    });
    
    it.skip('Deletes a film by id', () => {

    });

});