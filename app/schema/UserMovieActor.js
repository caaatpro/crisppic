'use strict';

exports = module.exports = function(app, mongoose) {
  var userMovieActorSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Actor' },
    count: { type: Number, default: 0 },
    dateUpdate: { type: Date, default: Date.now }
  });
  app.db.model('UserMovieActor', userMovieActorSchema);
};
