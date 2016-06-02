'use strict';

exports = module.exports = function(app, mongoose) {
  var peopleSchema = new mongoose.Schema({
    name: {
      russian: { type: String, default: '' },
      original: { type: String, default: '' }
    },
    sID: { type: Number, default: 0 }
  });
  app.db.model('People', peopleSchema);

  app.db.models.Index.findOne({ 'name': 'People' }).exec(function(err, r) {
    if (r == null) {
      var newI = new app.db.models.Index({
        name: 'People',
        sID: 1
      });
      newI.save(function (err, r) {

      });
    }
  });
};
