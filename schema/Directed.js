'use strict';

exports = module.exports = function(app, mongoose) {
    var directedSchema = new mongoose.Schema({
        name: { type: String, default: '' }
    });
    directedSchema.index({ name: 1 });
    app.db.model('Directed', directedSchema);
};
