const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { checkOk } = request;

describe('Reviews API', () => {

    beforeEach(() => dropCollection('reviews'));


    it.skip('Saves a reviewer', () => {

    });

    it.skip('Gets a list of reviewers', () => {

    });

    it.skip('Gets a reviewer by id', () => {

    });

    it.skip('Updates a reviewer by id', () => {

    });

});