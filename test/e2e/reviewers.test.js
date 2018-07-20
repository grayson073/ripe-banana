const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { checkOk } = request;

describe('Reviewers API', () => {

    beforeEach(() => dropCollection('reviewers'));
    
    function save(reviewer) {
        return request
            .post('/api/reviewers')
            .send(reviewer)
            .then(checkOk)
            .then(({ body }) => body);
    }

    let kevin;
    beforeEach(() => {
        return save({
            name: 'Kevin',
            company: 'Alchemy'
        })
            .then(data => {
                kevin = data;
            });
    });

    it('Saves a reviewer', () => {
        assert.isOk(kevin._id);
    });

});