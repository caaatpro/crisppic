'use strict';

exports = module.exports = function(app, mongoose) {
  var userMovieSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
    date: { type: Date, default: '' },
    comment: { type: String, default: '' },
    view: Boolean
  });
  userMovieSchema.index({ 'title.original': 'text', 'title.russian': 'text', desc: 'text'});
  app.db.model('UserMovie', userMovieSchema);
};
