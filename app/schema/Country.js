'use strict';

exports = module.exports = function(app, mongoose) {
    var countrySchema = new mongoose.Schema({
        name: {
            russian: { type: String, default: '' },
            original: { type: String, default: '' }
        },
        iso_3166_1: String,
        sID: Number
    });
    app.db.model('Country', countrySchema);

    app.db.models.Index.findOne({ 'name': 'Country' }).exec(function(err, r) {
        if (r == null) {
            var newI = new app.db.models.Index({
                name: 'Country',
                sID: 1
            });
            newI.save(function (err, r) {

            });
        }
    });
};
