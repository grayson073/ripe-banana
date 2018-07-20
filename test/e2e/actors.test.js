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
            .then(({ body }) => body);
    }

    let depp;
    beforeEach(() => {
        return save({
            name: 'Johny Depp'
        })
            .then(data => {
                depp = data;
            });          
    });

    it('Saves an actor', () => {
        assert.isOk(depp._id);
    });

    it('Gets a list of actors', () => {
        let mario;
        return save({
            name: 'Mario'
        })
            .then(_mario => {
                mario = _mario;
                return request.get('/api/actors');
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [depp, mario]);
            });
    });

});