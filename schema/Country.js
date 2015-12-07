'use strict';

exports = module.exports = function(app, mongoose) {
    var autoIncrement = require('mongoose-auto-increment');
    var countrySchema = new mongoose.Schema({
        name: {
            russian: { type: String, default: '' },
            original: { type: String, default: '' }
        },
        iso_3166_1: String,
        sID: Number
    });
    countrySchema.plugin(autoIncrement.plugin, { model: 'Country', field: 'sID', startAt: 1 });
    countrySchema.index({ name: 1 });
    app.db.model('Country', countrySchema);
};
