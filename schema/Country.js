'use strict';

exports = module.exports = function(app, mongoose) {
    var countrySchema = new mongoose.Schema({
        name: { type: String, default: '' }
    });
    countrySchema.index({ name: 1 });
    app.db.model('Country', countrySchema);
};
