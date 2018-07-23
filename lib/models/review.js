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
        required: true,
        maxlength: 140
    },
    film: {
        type: Schema.Types.ObjectId,
        ref: 'Film',
        required: true
    }
},
{
    timestamps: true
}
);

module.exports = mongoose.model('Review', schema);