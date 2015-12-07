'use strict';

exports = module.exports = function(app, mongoose) {
    var autoIncrement = require('mongoose-auto-increment');
    var genreSchema = new mongoose.Schema({
        name: {
            russian: {type: String, default: ''},
            original: {type: String, default: ''}
        },
        sID: Number
    });
    genreSchema.plugin(autoIncrement.plugin, { model: 'Genre', field: 'sID', startAt: 1 });
    genreSchema.index({ 'name.original': 'text', 'name.russian': 'text'});
    app.db.model('Genre', genreSchema);
};
