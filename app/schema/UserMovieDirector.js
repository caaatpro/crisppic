'use strict';

exports = module.exports = function(app, mongoose) {
  var userMovieDirectorSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    directorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Director' },
    count: { type: Number, default: 0 },
    dateUpdate: { type: Date, default: Date.now }
  });
  app.db.model('UserMovieDirector', userMovieDirectorSchema);
};
