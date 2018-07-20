const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    
    compnay: { 
        type: String,
        required: true
    } 
});

module.exports = mongoose.model('Reviewer', schema);