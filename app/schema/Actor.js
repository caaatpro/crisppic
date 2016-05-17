'use strict';

exports = module.exports = function(app, mongoose) {
  var actorSchema = new mongoose.Schema({
    name: {
      russian: { type: String, default: '' },
      original: { type: String, default: '' }
    },
    sID: { type: Number, default: 0 }
  });
  app.db.model('Actor', actorSchema);

  app.db.models.Index.findOne({ 'name': 'Actor' }).exec(function(err, r) {
    if (r == null) {
        var newI = new app.db.models.Index({
          name: 'Actor',
          sID: 1
        });
      newI.save(function (err, r) {

      });
    }
  });
};
