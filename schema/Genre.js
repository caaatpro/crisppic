'use strict';

exports = module.exports = function(app, mongoose) {
    var accountSchema = new mongoose.Schema({
        name: { type: String, default: '' }
    });
    accountSchema.index({ name: 1 });
    app.db.model('Genre', accountSchema);
};
