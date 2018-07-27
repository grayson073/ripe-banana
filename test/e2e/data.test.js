const { execSync } = require('child_process');
const { join } = require('path');
const mongoose = require('mongoose');
const studiosDataFile = join(__dirname, './data/studios-data.json');
const actorsDataFile = join(__dirname, './data/actors-data.json');
const filmsDataFile = join(__dirname, './data/films-data.json');
const reviewersDataFile = join(__dirname, './data/reviewers-data.json');
const reviewsDataFile = join(__dirname, './data/reviews-data.json');
const { dropCollection } = require('./db');

describe.only('Seed data API', () => {

    beforeEach(() => dropCollection('studios'));
    beforeEach(() => dropCollection('actors'));
    beforeEach(() => dropCollection('reviewers'));
    beforeEach(() => dropCollection('reviews'));
    beforeEach(() => dropCollection('films'));

    beforeEach(() => {
        execSync(`mongoimport --db ${mongoose.connection.name} --collection actors --drop --file ${actorsDataFile}`);
        execSync(`mongoimport --db ${mongoose.connection.name} --collection studios --drop --file ${studiosDataFile}`);
        execSync(`mongoimport --db ${mongoose.connection.name} --collection films --drop --file ${filmsDataFile}`);
        execSync(`mongoimport --db ${mongoose.connection.name} --collection reviewers --drop --file ${reviewersDataFile}`);
        execSync(`mongoimport --db ${mongoose.connection.name} --collection reviews --drop --file ${reviewsDataFile}`);
    });

    // TERMINAL commands to take seed data and export back to json data files (to keep same ObjectId)
    // mongoexport --db hollywood --collection studios --out studios-data.json
    // mongoexport --db hollywood --collection actors --out actors-data.json
    // mongoexport --db hollywood --collection films --out films-data.json
    // mongoexport --db hollywood --collection reviews --out reviews-data.json
    // mongoexport --db hollywood --collection reviewers --out reviewers-data.json

    it('Works...', () => {

    });

});
