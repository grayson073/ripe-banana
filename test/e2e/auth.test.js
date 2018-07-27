const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

const { checkOk } = request;


describe('Auth API', () => {

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

    it('Fails on a wrong password', () => {
        bill.password = 'bad';
        return request
            .post('/api/auth/signin')
            .send(bill)
            .then(res => {
                assert.equal(res.status, 401);
                assert.equal(res.body.error, 'The interwebz doesn\'t care for your email or password');
            });
    });

    it('Cannot sign up with same email', () => {
        return request
            .post('/api/auth/signup')
            .send(bill)
            .then(res => {
                assert.equal(res.status, 400);
                assert.equal(res.body.error, 'Email already in use');
            });
    });

    it('Gives 401 on bad email signin', () => {
        bill.email = 'bad@me.com';
        return request
            .post('/api/auth/signin')
            .send(bill)
            .then(res => {
                assert.equal(res.status, 401);
                assert.equal(res.body.error, 'The interwebz doesn\'t care for your email or password');
            });
    });

});