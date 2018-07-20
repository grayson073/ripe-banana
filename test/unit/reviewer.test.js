const { assert } = require('chai');
const Reviewer = require('../../lib/models/reviewer');
const { getErrors } = require('./helpers');

describe('Reviewer model', () => {

    it('Validates good model', () => {
        const data = {
            name: 'Joan Sebastian',
            company: 'PEMEX'
        };

        const reviewer = new Reviewer(data);

        const json = reviewer.toJSON();
        delete json._id;
        assert.deepEqual(json, data);
        assert.isUndefined(reviewer.validateSync());
    });

    it('Requires a reviewer name and company', () => {
        const reviewer = new Reviewer({});
        const errors = getErrors(reviewer.validateSync(), 2);
        assert.equal(errors.name.kind, 'required');
        assert.equal(errors.company.kind, 'required');
        
    });

});