const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { checkOk } = request;
const { saveActor, saveFilm, saveReview, saveStudio, makeReview } = require('./_helpers');

describe.only('Reviews API', () => {

    beforeEach(() => dropCollection('reviewers'));
    beforeEach(() => dropCollection('reviews'));
    beforeEach(() => dropCollection('films'));
    beforeEach(() => dropCollection('studios'));
    beforeEach(() => dropCollection('actors'));

    let token;
    let ebert;
    beforeEach(() => {
        let data = {
            name: 'Kevin',
            company: 'HGF',
            email: 'email@email.com',
            password: 'password',
            roles: ['admin']
        };
        return request
            .post('/api/auth/signup')
            .send(data)
            .then(checkOk)
            .then(({ body }) => {
                token = body.token;
                delete body.reviewer.__v;
                ebert = body.reviewer;
            });
    });
    
    let warner;
    beforeEach(() => {
        return saveStudio(
            {
                name: 'Warner',
                address: {
                    city: 'Los Angeles',
                    state: 'California',
                    country: 'USA'
                }
            },
            token
        )
            .then(data => {
                warner = data;
            });
    });
    
    let downey; 
    beforeEach(() => {
        return saveActor(
            {
                name: 'Robert Downey Jr.'
            },
            token
        )
            .then(data => {
                downey = data;
            });       
    });

    let avengers;
    beforeEach(() => {
        return saveFilm(
            {
                title: 'Avengers',
                studio: warner._id,
                released: 2015,
                cast: [{
                    role: 'Tony Stark',
                    actor: downey._id
                }]
            },
            token
        )
            .then(data => {
                avengers = data;
            });
    });

    let review1;
    beforeEach(() => {
        return saveReview(
            {
                rating: 5,
                reviewer: ebert._id,
                review: 'this is good',
                film: avengers._id,
            },
            token
        )
            .then(data => {
                review1 = data;
            });
    });

    it('Saves a review', () => {
        assert.isOk(review1._id);
    });

    it('Gets a list of reviews', () => {
        return request
            .get('/api/reviews')
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [makeReview(review1, avengers)]);
            });
    });

    it('Updates a reviews by id', () => {
        review1.rating = 1;
        review1.review = 'BEST MOVIE EVER...NOT';
        return request
            .put(`/api/reviews/${review1._id}`)
            .send(review1)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body.rating, review1.rating);
                assert.deepEqual(body.review, review1.review);
            });
    });
});