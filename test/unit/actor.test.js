const { assert } = require('chai');
const Actor = require('../../lib/models/actor');
const { getErrors } = require('./helpers');

describe('Actor model', () => {

    it('Validates good model', () => {
        const data = {
            name: 'Johnny Depp',
            dob: '07/15/1960',
            pob: 'Tennessee'
        };

        const actor = new Actor(data);

        const json = actor.toJSON();
        delete json._id;
        assert.deepEqual(json, data);
        assert.isUndefined(actor.validateSync());
    });

    it('Requires an actor name', () => {
        const actor = new Actor({});
        const errors = getErrors(actor.validateSync(), 1);
        assert.equal(errors.name.kind, 'required');
        
    });

});