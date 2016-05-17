'use strict';

exports = module.exports = function(app, mongoose) {
  var indexSchema = new mongoose.Schema({
    name: { type: String, default: '' },
    sID: { type: Number, default: 0 }
  });
  app.db.model('Index', indexSchema);
};
