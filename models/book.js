const mongoose = require('mongoose')

const genres = Object.freeze({
  Classics: 'classics',
  Comic: 'comic',
  Detective: 'detective',
  Fantasy: 'fantasy',
  Fiction: 'fiction',
  Horror: 'horror',
  Romance: 'romance',
  ScienceFiction: 'science fiction',
  Biography: 'biography'
})

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  author: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    required: true,
    enum: Object.values(genres)
  },
  publication_year: {
    type: Number,
    required: true
  },
  abstract: { 
    type: String,
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

bookSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('book already exists'));
  } else {
    next();
  }
});

module.exports = mongoose.model('Book', bookSchema)