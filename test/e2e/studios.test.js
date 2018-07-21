const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { checkOk } = request;

describe.only('Studios API', () => {

    beforeEach(() => dropCollection('studios'));
    beforeEach(() => dropCollection('films'));
    beforeEach(() => dropCollection('actors'));

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
        return request
            .post('api/actors')
            .send({ name: 'Al Pacino' })
            .then(({ body }) => pacino = body);
    });

    let dogDay;
    beforeEach(() => {
        return save({
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
        console.log(univision._id);
        assert.isOk(univision._id);
    });

    it('Gets a list of studios', () => {
        let fox;
        return save({
            name: 'Fox'
        })
            .then(_fox => {
                fox = _fox;
                return request.get('/api/studios');
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [univision, fox]);
            });
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

    it('Gets a studio by id', () => {
        return request
            .get(`/api/studios/${univision._id}`)
            .then(({ body }) => {
                assert.deepEqual(body, univision);
            });
    });
});