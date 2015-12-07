'use strict';

exports = module.exports = function(app, mongoose) {
  var userMovieNoteSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
    note: { type: String, default: '' },
    dateUpdate: { type: Date, default: Date.now }
  });
  app.db.model('UserMovieNote', userMovieNoteSchema);
};
