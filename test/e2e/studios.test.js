const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { checkOk } = request;

describe('Studios API', () => {

    beforeEach(() => dropCollection('studios'));
    beforeEach(() => dropCollection('films'));
    beforeEach(() => dropCollection('actors'));

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
 
    let univision;
    beforeEach(() => {
        return saveStudio({
            name: 'Univision',
            address: {
                city: 'Portland',
                state: 'Oregon',
                country: 'USA'
            }
        })
            .then(data => {
                univision = data;
            });
    });

    let pacino; 
    beforeEach(() => {
        return saveActor({
            name: 'Al Pacino'
        })
            .then(data => {
                pacino = data;
            });       
    });

    let dogDay;
    beforeEach(() => {
        return saveFilm({
            title: 'Dog Day',
            studio: univision._id,
            released: 1990,
            cast: [{
                actor: pacino._id
            }]
        })
            .then(data => {
                dogDay = data;
            });
    });



    it('Saves a studio', () => {
        assert.isOk(univision._id);
    });

    it('Gets a list of studios', () => {
        let fox;
        return saveStudio({
            name: 'Fox',
            
        })
            .then(_fox => {
                fox = _fox;
                return request.get('/api/studios');
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body[0].name, univision.name);
                assert.deepEqual(body[1].name, fox.name);
            });
    });

    const makeStudio = (studio, film) => {
        const combined = {
            _id: studio._id,
            name: studio.name,
            address: studio.address
        };
        combined.films = [{
            _id: film._id,
            title: film.title,
        }];
        return combined;

    } ;

    it('Gets a studio by id', () => {
        return request
            .get(`/api/studios/${univision._id}`)
            .then(({ body }) => {
                assert.deepEqual(body, makeStudio(univision, dogDay));
            });
    });

    it.skip('Deletes a studio by id', () => {

    });


});