'use strict';

exports = module.exports = function(app, mongoose) {
    var genreSchema = new mongoose.Schema({
        name: {
            russian: {type: String, default: ''},
            original: {type: String, default: ''}
        },
        sID: { type: Number, default: 0 }
    });
    app.db.model('Genre', genreSchema);

    app.db.models.Index.findOne({ 'name': 'Genre' }).exec(function(err, r) {
        if (r == null) {
            var newI = new app.db.models.Index({
                name: 'Genre',
                sID: 1
            });
            newI.save(function (err, r) {

            });
        }
    });
};
