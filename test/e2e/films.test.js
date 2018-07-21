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

    let rock;
    beforeEach(() => {
        return request
            .post('/api/actors')
            .send({ name: 'The Rock' })
            .then(({ body }) => rock = body);
    });

    let scarface;
    beforeEach(() => {
        return save({
            title: 'Scarface',
            studio: fox._id,
            released: 1982,
            cast: [{
                actor: rock._id
            }]
        })
            .then(data => {
                scarface = data;
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
        return save({ 
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


    const makeFilm2 = (film, studio, actor) => {
        const combined = {
            _id: film._id,
            title: film.title,
            released: film.released
        };

        combined.studio = {
            _id: studio._id,
            name: studio.name
        };

        combined.cast = [{
            actor: {
                _id: actor._id,
                name: actor.name
            }    
        }];

        return combined;

    } ;

    it('Gets a film by id', () => {
        return request
            .get(`/api/films/${scarface._id}`)
            .then(({ body }) => {
                assert.deepEqual(body, 
                    makeFilm2(scarface, fox, rock)
                );
            });
    }); 

});