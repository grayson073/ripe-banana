const { assert } = require('chai');
const { Types } = require('mongoose');
const Film = require('../../lib/models/film');
// const { getErrors } = require('./helpers');

describe('Film model', () => {
    
    it('Validates good model', () => {
        const data = { 
            title: 'Scarface',
            studio: Types.ObjectId(),
            released: 1990,
            cast: [{
                role: 'Tony Montana',
                actor: Types.ObjectId(),
            }] 
        };

        const film = new Film(data);
        const json = film.toJSON();
        delete json._id;
        json.cast.forEach(c => delete c._id);
        assert.deepEqual(json, data);
        assert.isUndefined(film.validateSync(), 3);
    });
});