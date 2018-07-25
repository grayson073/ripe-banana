const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

const { checkOk } = request;

describe.only('Auth API', () => {

    beforeEach(() => dropCollection('reviewers'));

    let token;
    let bill = {
        name: 'Bill',
        company: 'HGF',
        email: 'email@email.com',
        password: 'password'
    };
    beforeEach(() => {
        return request
            .post('/api/auth/signup')
            .send(bill)
            .then(checkOk)
            .then(({ body }) => {
                token = body.token;
            });
    });

    it('Signs up a reviewer', () => {
        assert.isDefined(token);
    });

    it('Verifies a token', () => {
        return request
            .get('/api/auth/verify')
            .set('Authorization', token)
            .then(checkOk);
    });

    it('Can sign in a user', () => {
        return request
            .post('/api/auth/signin')
            .send(bill)
            .then(checkOk)
            .then(({ body }) => {
                assert.isDefined(body.token);
            });
    });

});