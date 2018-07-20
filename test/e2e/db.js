const connect = require('../../lib/util/connect');
connect('mongodb://localhost:27017/hollywood');
const mongoose = require('mongoose');

after(() => {
    return mongoose.connection.close();
});

module.exports = {
    dropCollection(name) {
        return mongoose.connection.dropCollection(name)
            .catch(err => {
                if(err.codename !== 'NamespaceNotFound') throw err;
            });
    }
};