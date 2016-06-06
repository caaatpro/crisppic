'use strict';

exports = module.exports = function(app, mongoose) {
    var movieSchema = new mongoose.Schema({
        title: {
            russian: { type: String, default: '' },
            original: { type: String, default: '' }
        },
        genre: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Genre' }],
        country: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Country' }],
        people: [{ type: mongoose.Schema.Types.ObjectId, ref: 'People', role: '' }],
        runtime: Number,
        year: Number,
        released: { type: Date, default: null },
        plot: String,
        imdbID: String,
        sID: Number,
        wishList: Number,
        views: Number,
        viewsUser: Number,
        dateUpdate: { type: Date, default: Date.now },
        poster: { type: String, default: '' },
        search: String
    });
    movieSchema.index({ 'title.original': 'text', 'title.russian': 'text', 'plot': 'text'});
    app.db.model('Movie', movieSchema);

    app.db.models.Index.findOne({ 'name': 'Movie' }).exec(function(err, r) {
        if (r == null) {
            var newI = new app.db.models.Index({
                name: 'Movie',
                sID: 1
            });
            newI.save(function (err, r) {

            });
        }
    });
};
