const { assert } = require('chai');
const Reviewer = require('../../lib/models/reviewer');
const { getErrors } = require('./_helpers');

describe('Reviewer model', () => {

    it('Validates good model', () => {
        const data = {
            name: 'Joan Sebastian',
            company: 'PEMEX',
            email: 'email@email.com',
            password: 'password',
            roles: []
        };

        const reviewer = new Reviewer(data);

        assert.equal(reviewer.email, data.email);
        assert.isUndefined(reviewer.password, 'Password should not be set');

        reviewer.generateHash(data.password);
        assert.isDefined(reviewer.hash, 'Hash is defined');
        assert.notEqual(reviewer.hash, data.password, 'Hash is not the same as password');
        assert.isUndefined(reviewer.validateSync());

        assert.isTrue(reviewer.comparePassword(data.password), 'Compare good password');
        assert.isFalse(reviewer.comparePassword('Bad password'), 'Compare bad password');
    });

    it('Requires a reviewer name and company', () => {
        const reviewer = new Reviewer({});
        const errors = getErrors(reviewer.validateSync(), 4);
        assert.equal(errors.name.kind, 'required');
        assert.equal(errors.company.kind, 'required');
        assert.equal(errors.email.kind, 'required');
        assert.equal(errors.hash.kind, 'required');
        
    });

});