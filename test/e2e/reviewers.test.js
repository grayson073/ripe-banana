const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { checkOk } = request;
const { saveActor, saveFilm, saveReview, saveReviewer, saveStudio, makeReviewer } = require('./_helpers');

describe('Reviewers API', () => {

    beforeEach(() => dropCollection('reviewers'));
    beforeEach(() => dropCollection('reviews'));
    beforeEach(() => dropCollection('films'));
    beforeEach(() => dropCollection('studios'));
    beforeEach(() => dropCollection('actors'));

    let token;
    let kevin;
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
                kevin = body.reviewer;
            });
    });
    
    let warner;
    beforeEach(() => {
        return saveStudio({
            name: 'Warner',
            address: {
                city: 'Los Angeles',
                state: 'California',
                country: 'USA'
            }
        })
            .then(data => {
                warner = data;
            });
    });
    
    let downey; 
    beforeEach(() => {
        return saveActor({
            name: 'Robert Downey Jr.'
        })
            .then(data => {
                downey = data;
            });       
    });

    let avengers;
    beforeEach(() => {
        return saveFilm({
            title: 'Avengers',
            studio: warner._id,
            released: 2015,
            cast: [{
                role: 'Tony Stark',
                actor: downey._id
            }]
        })
            .then(data => {
                avengers = data;
            });
    });

    let review1;
    beforeEach(() => {
        return saveReview(
            {
                rating: 5,
                reviewer: kevin._id,
                review: 'this is good',
                film: avengers._id,
            },
            token
        )
            .then(data => {
                review1 = data;
            });
    });

    it('Saves a reviewer', () => {
        assert.isOk(kevin._id);
    });

    it('Gets a list of reviewers', () => {
        return request
            .get('/api/reviewers')
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [kevin]);
            });
    });

    it('Gets a reviewer by id', () => {
        return request
            .get(`/api/reviewers/${kevin._id}`)
            .then(({ body }) => {
                assert.deepEqual(body, makeReviewer(kevin, review1, avengers));
            });
    });

    it('Updates a reviewer by id', () => {
        kevin.company = 'Epicodus Reviews';
        kevin.name = 'John Reviewer';
        return request
            .put(`/api/reviewers/${kevin._id}`)
            .send(kevin)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, kevin);
            });
    });
});