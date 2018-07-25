require('dotenv').config();
const connect = require('../lib/util/connect');
const Reviewer = require('../lib/models/user');
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pirates';
connect(MONGODB_URI);

Reviewer.findByIdAndUpdate(
    // ObjectId here ,
    {
        $addToSet: {
            roles: 'admin'
        }
    }
)
    .catch(console.log('Database error'))
    .then(() => mongoose.connection.close());