const request = require('./request');
const { checkOk } = request;

function saveReview(review) {
    return request
        .post('/api/reviews')
        .send(review)
        .then(checkOk)
        .then(({ body }) => {
            delete body.__v;
            return body;
        });
}

function saveReviewer(reviewer) {
    return request
        .post('/api/reviewers')
        .send(reviewer)
        .then(checkOk)
        .then(({ body }) => {
            delete body.__v;
            return body;
        });
}

function saveFilm(film) {
    return request
        .post('/api/films')
        .send(film)
        .then(checkOk)
        .then(({ body }) => {
            delete body.__v;
            return body;
        });
}

function saveStudio(studio) {
    return request
        .post('/api/studios')
        .send(studio)
        .then(checkOk)
        .then(({ body }) => {
            delete body.__v;
            return body;
        });
}

function saveActor(actor) {
    return request
        .post('/api/actors')
        .send(actor)
        .then(checkOk)
        .then(({ body }) => {
            delete body.__v;
            return body;
        });
}

const makeFilm = (film, studio) => {
    const combined = {
        _id: film._id,
        title: film.title,
        released: film.released
    };
    combined.studio = {
        _id: studio._id,
        name: studio.name
    };
    return combined;
} ;

const makeFilm2 = (film, studio, actor, review, reviewer) => {
    const combined = {
        _id: film._id,
        title: film.title,
        released: film.released,
    };
    
    combined.studio = {
        _id: studio._id,
        name: studio.name
    };
    
    combined.cast = [{
        actor: {
            _id: actor._id,
            name: actor.name
        },  
        role: film.cast[0].role
    }];

    combined.reviews = [{
        _id: review._id,
        rating: review.rating,
        review: review.review,

        reviewer: {
            _id: reviewer._id,
            name: reviewer.name
        }
    }];
    return combined;
} ;

const makeReviewer = (reviewer, review, film) => {
    const combined = {
        _id: reviewer._id,
        name: reviewer.name,
        company: reviewer.company
    };
    combined.reviews = [{
        _id: review._id,
        rating: review.rating,
        review: review.review,
        film: {
            _id: film._id,
            title: film.title
        }
    }];
    return combined;
};

const makeStudio = (studio, film) => {
    const combined = {
        _id: studio._id,
        name: studio.name,
        address: studio.address
    };
    combined.films = [{
        _id: film._id,
        title: film.title,
    }];
    return combined;
};

const makeReview = (review, film) => {
    const combined = {
        _id: review._id,
        rating: review.rating,
        review: review.review
    };
    combined.film = {
        _id: film._id,
        title: film.title,
    };
    return combined;
};

module.exports = {
    saveActor,
    saveFilm,
    saveReview,
    saveReviewer,
    saveStudio,
    makeFilm,
    makeFilm2,
    makeReviewer,
    makeStudio,
    makeReview
};