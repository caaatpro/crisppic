'use strict';

exports = module.exports = function(app, mongoose) {
    var directorSchema = new mongoose.Schema({
        name: {
            russian: { type: String, default: '' },
            original: { type: String, default: '' }
        },
        sID: Number
    });
    app.db.model('Director', directorSchema);

    app.db.models.Index.findOne({ 'name': 'Director' }).exec(function(err, r) {
        if (r == null) {
            var newI = new app.db.models.Index({
                name: 'Director',
                sID: 1
            });
            newI.save(function (err, r) {

            });
        }
    });
};
