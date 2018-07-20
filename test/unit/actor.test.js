const { assert } = require('chai');
const Actor = require('../../lib/models/actor');

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

});