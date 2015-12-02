'use strict';

exports = module.exports = function(app, mongoose) {
    var genreSchema = new mongoose.Schema({
        name: { type: String, default: '' }
    });
    genreSchema.index({ name: 1 });
    app.db.model('Genre', genreSchema);
};
