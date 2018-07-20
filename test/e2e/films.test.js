const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { checkOk } = request;

describe('Films API', () => {

    beforeEach(() => dropCollection('films'));
    beforeEach(() => dropCollection('studios'));
    beforeEach(() => dropCollection('actors'));

    function save(film) {
        return request
            .post('/api/films')
            .send(film)
            .then(checkOk)
            .then(({ body }) => body);
    }

    let fox;
    beforeEach(() => {
        return request
            .post('/api/studios')
            .send({ name: 'Fox' })
            .then(({ body }) => fox = body);
    });

    let depp;
    beforeEach(() => {
        return request
            .post('/api/actors')
            .send({ name: 'The Rock' })
            .then(({ body }) => depp = body);
    })

    let scarface;
    beforeEach(() => {
        return save({
            title: 'Scarface',
            studio: fox._id,
            cast: [{
                actor: depp._id
            }]
        })
            .then(data => {
                scarface = data;
            });
    });

    it('Saves a film', () => {
        assert.isOk(scarface._id);
    });

});