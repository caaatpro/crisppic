'use strict';

exports = module.exports = function(app, mongoose) {
  var userMovieSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
    date: { type: Date, default: '' },
    view: Boolean,
    dateUpdate: { type: Date, default: Date.now }
  });
  app.db.model('UserMovie', userMovieSchema);
};
