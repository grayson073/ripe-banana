const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

const { checkOk } = request;

describe.only('Auth API', () => {

    beforeEach(() => dropCollection('reviewers'));

    let token;
    beforeEach(() => {
        return request
            .post('/api/auth/signup')
            .send({
                email: 'email@email.com',
                password: 'password'
            })
            .then(checkOk)
            .then(({ body }) => {
                token = body.token;
            });
    });

    it('Signs up a reviewer', () => {
        assert.isDefined(token);
    });

});