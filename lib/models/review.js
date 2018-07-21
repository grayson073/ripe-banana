const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    rating: {
        type: Number,
        required: true
    },
    reviewer: {
        type: Schema.Types.ObjectId,
        ref: 'Reviewer',
        required: true
    },
    review: {
        type: String,
        required: true
    },
    film: {
        type: Schema.Types.ObjectId,
        ref: 'Film',
        required: true
    },
    timestamps: {
        type: Date,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    } 
});

module.exports = mongoose.model('Review', schema);