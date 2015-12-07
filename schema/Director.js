'use strict';

exports = module.exports = function(app, mongoose) {
    var autoIncrement = require('mongoose-auto-increment');
    var directorSchema = new mongoose.Schema({
        name: {
            russian: { type: String, default: '' },
            original: { type: String, default: '' }
        },
        sID: Number
    });
    directorSchema.plugin(autoIncrement.plugin, { model: 'Director', field: 'sID', startAt: 1 });
    directorSchema.index({ name: 1 });
    app.db.model('Director', directorSchema);
};
