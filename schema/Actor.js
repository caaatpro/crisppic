'use strict';

exports = module.exports = function(app, mongoose) {
  var autoIncrement = require('mongoose-auto-increment');
  var actorSchema = new mongoose.Schema({
    name: {
      russian: { type: String, default: '' },
      original: { type: String, default: '' }
    },
    sID: Number
  });
  actorSchema.plugin(autoIncrement.plugin, { model: 'Actor', field: 'sID', startAt: 1 });
  actorSchema.index({ name: 1 });
  app.db.model('Actor', actorSchema);
};
