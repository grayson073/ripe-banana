const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { checkOk } = request;
const { saveActor, saveFilm, saveStudio } = require('./_helpers');

describe('Actors API', () => {

    beforeEach(() => dropCollection('reviewers'));
    beforeEach(() => dropCollection('reviews'));
    beforeEach(() => dropCollection('films'));
    beforeEach(() => dropCollection('studios'));
    beforeEach(() => dropCollection('actors'));

    let token;
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
            });
    });

    let depp;
    beforeEach(() => {
        return saveActor(
            {
                name: 'Johnny Depp',
                dob: '1960',
                pob: 'Wherever, USA'
            },
            token
        )
            .then(data => {
                depp = data;
            });          
    });

    let univision;
    beforeEach(() => {
        return saveStudio(
            {
                name: 'Univision',
                address: {
                    city: 'Portland',
                    state: 'Oregon',
                    country: 'USA'
                }
            },
            token
        )
            .then(data => {
                univision = data;
            });
    });

    let dogDay;
    beforeEach(() => {
        return saveFilm(
            {
                title: 'Dog Day',
                studio: univision._id,
                released: 1990,
                cast: [{
                    actor: depp._id
                }]
            },
            token
        )
            .then(data => {
                dogDay = data;
            });
    });

    it('Saves an actor', () => {
        assert.isOk(depp._id);
    });

    it('Gets a list of actors', () => {
        let diesel;
        return saveActor(
            {
                name: 'Vin Diesel',
                dob: '1965',
                pob: 'California, USA'
            },
            token)
            .then(data => {
                diesel = data;
                return request.get('/api/actors');
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body[0].name, depp.name);
                assert.deepEqual(body[1].name, diesel.name);
            });
    });

    const makeActor = (actor, film) => {
        const combined = {
            _id: actor._id,
            name: actor.name,
            dob: actor.dob,
            pob: actor.pob
        };
        combined.films = [{
            _id: film._id,
            title: film.title,
            released: film.released
        }];
        return combined;
    };

    it('Gets an actor by id', () => {
        return request
            .get(`/api/actors/${depp._id}`)
            .then(({ body }) => {
                assert.deepEqual(body, makeActor(depp, dogDay));
            });
    });

    it('Updates an actor by id', () => {
        depp.name = 'Johnny';
        depp.dob = '1990';
        return request
            .put(`/api/actors/${depp._id}`)
            .set('Authorization', token)
            .send(depp)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, depp);
            });
    });

    it('Does not delete actor who are in films', () => {
        return request
            .delete(`/api/actors/${depp._id}`)
            .set('Authorization', token)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, { removed: false });
            });
    });

    it('Deletes an actor by id', () => {
        return request
            .delete(`/api/films/${dogDay._id}`)
            .set('Authorization', token)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, { removed: true });
                return request
                    .delete(`/api/actors/${depp._id}`)
                    .set('Authorization', token);
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, { removed: true });
            });
    });
});