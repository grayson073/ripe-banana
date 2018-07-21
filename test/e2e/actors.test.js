const { assert } = require('chai');
const request = require('./request');
const { dropCollection } =  require('./db');
const { checkOk } =  request;


describe('Actors API', () => {

    beforeEach(() => dropCollection('actors'));

    function save(actor) {
        return request
            .post('/api/actors')
            .send(actor)
            .then(checkOk)
            .then(({ body }) => {
                delete body.__v;
                return body;
            });
    }

    let depp;
    beforeEach(() => {
        return save({
            name: 'Johnny Depp'
        })
            .then(data => {
                depp = data;
            });          
    });

    let mario;
    beforeEach(() => {
        return save({
            name: 'Mario'
        })
            .then(data => {
                mario = data;
            });          
    });

    it('Saves an actor', () => {
        assert.isOk(depp._id);
    });

    it('Gets a list of actors', () => {
        return request
            .get('/api/actors')
            .then(({ body }) => {
                assert.deepEqual(body, [depp, mario]);
            });
    });

    it.skip('Gets an actor by id', () => {
        return request
            .get(`/api/actors/${depp._id}`)
            .then(({ body }) => {
                assert.deepEqual(body, depp);
            });
    });

    it('Updates an actor by id', () => {
        depp.name = 'Johnny';
        depp.dob = '1990';
        return request
            .put(`/api/actors/${depp._id}`)
            .send(depp)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, depp);
            });
    });

    it.skip('Deletes an actor by id', () => {

    });

});