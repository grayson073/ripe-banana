const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { checkOk } = request;
const { saveActor, saveFilm, saveReview, saveReviewer, saveStudio, makeFilm, makeFilm2 } = require('./_helpers');

describe('Films API', () => {

    beforeEach(() => dropCollection('films'));
    beforeEach(() => dropCollection('studios'));
    beforeEach(() => dropCollection('actors'));

    let ebert;
    beforeEach(() => {
        return saveReviewer({
            name: 'Roger Ebert',
            company: 'Ebert Reviews'
        })
            .then(data => {
                ebert = data;
            });
    });
    
    let fox;
    beforeEach(() => {
        return saveStudio({
            name: 'Fox'
        })
            .then(data => {
                fox = data;
            });
    });
    
    let rock; 
    beforeEach(() => {
        return saveActor({
            name: 'The Rock'
        })
            .then(data => {
                rock = data;
            });       
    });

    let scarface;
    beforeEach(() => {
        return saveFilm({
            title: 'Scarface',
            studio: fox._id,
            released: 2015,
            cast: [{
                role: 'Tony Montana',
                actor: rock._id
            }]
        })
            .then(data => {
                scarface = data;
            });
    });

    let review1;
    beforeEach(() => {
        return saveReview({
            rating: 5,
            reviewer: ebert._id,
            review: 'this is good',
            film: scarface._id,
        })
            .then(data => {
                review1 = data;
            });
    });

    it('Saves a film', () => {
        assert.isOk(scarface._id);
    });

    it('Gets a list of films', () => {
        let topGun;
        return saveFilm({ 
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

    it('Gets a film by id', () => {
        return request
            .get(`/api/films/${scarface._id}`)
            .then(({ body }) => {
                assert.deepEqual(body, 
                    makeFilm2(scarface, fox, rock, review1, ebert)
                );
            });
    });
    
    it('Deletes a film by id', () => {
        return request
            .delete(`/api/films/${scarface._id}`)
            .then(checkOk)
            .then(res => {
                assert.deepEqual(res.body, { removed: true });
                return request.get('/api/films');
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, []);
            });
    });
});