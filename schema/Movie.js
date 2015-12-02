'use strict';

exports = module.exports = function(app, mongoose) {
    var movieSchema = new mongoose.Schema({
        title: {
            russian: { type: String, default: '' },
            original: { type: String, default: '' }
        },
        genre: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Genre' }],
        country: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Country' }],
        directed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Directed' }],
        duration: Number,
        year: Number,
        date: Date,
        desc: String,
        imdbId: Number,
        sid: Number,
        search: String
    });
    movieSchema.index({ 'title.original': 'text', 'title.russian': 'text', desc: 'text'});
    app.db.model('Movie', movieSchema);
};
