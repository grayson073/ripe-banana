const { assert } = require('chai');
const Studio = require('../../lib/models/studio');
const { getErrors } = require('./helpers');

describe('Studio model', () => {

    it('Validates good model', () => {
        const data = {
            name: 'Univision',
            address: {
                city: 'Seattle',
                state: 'Washignton',
                country: 'MURICA'
            }
        };

        const studio = new Studio(data);

        const json = studio.toJSON();
        delete json._id;
        assert.deepEqual(json, data);
        assert.isUndefined(studio.validateSync());
    });

    it('Requires a studio name', () => {
        const studio = new Studio({});
        const errors = getErrors(studio.validateSync(), 1);
        assert.equal(errors.name.kind, 'required');
    });

});