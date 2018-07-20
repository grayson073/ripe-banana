const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { checkOk } = request;

describe('Studios API', () => {

    beforeEach(() => dropCollection('studios'));

    function save(studio) {
        return request
            .post('/api/studios')
            .send(studio)
            .then(checkOk)
            .then(({ body }) => body);
    }

    let univision;
    beforeEach(() => {
        return save({
            name: 'Univision'  
        })
            .then(data => {
                univision = data;
            });
    });


    it('Saves a studio', () => {
        assert.isOk(univision._id);
    });
});