const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { checkOk } = request;

describe('Reviews API', () => {

    beforeEach(() => dropCollection('reviews'));

    function save(review) {
        return request
            .post('/api/reviews')
            .send(review)
            .then(checkOk)
            .then(({ body }) => {
                delete body.__v;
                return body;
            });
    }

    let review1;
    beforeEach(() => {
        return save ({
            rating: 5,
            reviewer: ebert._id,
            review: 'this is good',
            film: avengers._id,
        })
            .then(data => {
                review1 = data;
            });
    });

    it('Saves a review', () => {
        assert.isOk(review1._id);

    });

    it.skip('Gets a list of reviews', () => {

    });


    it.skip('Updates a reviews by id', () => {

    });

});