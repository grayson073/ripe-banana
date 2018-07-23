const { assert } = require('chai');
const { Types } = require('mongoose');
const Review = require('../../lib/models/review');
const { getErrors } = require('./_helpers');

describe('Review model', () => {

    
    it('Validates good model', () => {
        const data = {
            rating: 5,
            reviewer: Types.ObjectId(),
            review: 'It was good',
            film: Types.ObjectId(),
            // timestamps: {

            //     createdAt: new Date(),
            //     updatedAt:  new Date(),
            // }
        };

        const review = new Review(data);
        review.save();
        console.log('thissssss', review.timestamps);
        const json = review.toJSON();
        delete json._id;
        assert.isUndefined(review.validateSync());
        
    });

    it('Validates required fields', () => {
        const review = new Review({});
        const errors = getErrors(review.validateSync(), 4);

        assert.equal(errors.rating.kind, 'required'); 
        assert.equal(errors.reviewer.kind, 'required'); 
        assert.equal(errors.film.kind, 'required'); 
        assert.equal(errors.review.kind, 'required'); 
    });
});