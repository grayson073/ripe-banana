const router = require('express').Router();
const Reviewer = require('../models/reviewer');
const { HttpError } = require('../util/errors');
const tokenService = require('../util/token-service');
const ensureAuth = require('../util/ensure-auth')();

const getCredentials = body => {
    const { email, password } = body;
    delete body.password;
    return { email, password };
};

module.exports = router

    .get('/verify', ensureAuth, (req, res) => {
        res.json({ verified: true });
    })

    .post('/signup', ({ body }, res, next) => {
        const { email, password } = getCredentials(body);
        let reviewer;
        Reviewer.findOne({ email })
            .countDocuments()
            .then(count => {
                if(count > 0) {
                    throw new HttpError({
                        code: 400,
                        message: 'Email already in use'
                    });
                }

                const reviewer = new Reviewer(body);
                reviewer.generateHash(password);
                return reviewer.save();
            })
            .then(saved => {
                reviewer = saved;
                return saved;
            })
            .then(reviewer => tokenService.sign(reviewer))
            .then(token => res.json({ token, reviewer }))
            .catch(next);
    })

    .post('/signin', ({ body }, res, next) => {
        const { email, password } = getCredentials(body);

        Reviewer.findOne({ email })
            .then(reviewer => {
                if(!reviewer || !reviewer.comparePassword(password)) {
                    throw new HttpError({
                        code: 401,
                        message: 'The interwebz doesn\'t care for your email or password'
                    });
                }
                return tokenService.sign(reviewer);
            })
            .then(token => res.json({ token }))
            .catch(next);
    });