'use strict';

exports = module.exports = function(app, mongoose) {
    var autoIncrement = require('mongoose-auto-increment');
    var movieSchema = new mongoose.Schema({
        title: {
            russian: { type: String, default: '' },
            original: { type: String, default: '' }
        },
        genre: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Genre' }],
        country: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Country' }],
        director: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Director' }],
        actors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Actor' }],
        runtime: Number,
        year: Number,
        released: { type: Date, default: null },
        plot: String,
        imdbID: String,
        sID: Number,
        wishlist: Number,
        views: Number,
        viewsUser: Number,
        dateUpdate: { type: Date, default: Date.now },
        poster: { type: String, default: '' },
        search: String
    });
    movieSchema.plugin(autoIncrement.plugin, { model: 'Movie',  field: 'sID', startAt: 1 });
    movieSchema.index({ 'title.original': 'text', 'title.russian': 'text', desc: 'text'});
    app.db.model('Movie', movieSchema);
};
