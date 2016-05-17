'use strict';

exports = module.exports = function(req, res, id) {
  var async = require('async'),
      request = require('request'),
      fs = require('fs'),

      genre = [],
      director = [],
      actors = [],
      country = [],
      year = null,
      released = null,
      runtime = 0,
      poster = "",
      plot = "",
      title = "",
      imdbID = id,

      asyncTotal = 0;

  var validateMovie = function() {
    req.app.db.models.Movie.findOne({ 'imdbID': imdbID }).exec(function(err, r) {
      if (r == null) {
        getMovie();
      } else {
        return res.redirect('/movie/'+r['sID']+'/');
      }
    });
  };

  var getMovie = function() {
    request('http://www.omdbapi.com/?i='+id+'&plot=full&r=json', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        try {
          var data = JSON.parse(body);
        } catch (e) {
          return false;
        }

        if (data['Response'] == 'False') {
          console.log(data['Error']);
          return false;
        } else {
          if (data['Type'] != 'movie') {
            console.log("Type not movie");
            return false;
          }

          title = data['Title'];

          if (data['Year'] != 'N/A') {
            year = data['Year'];
          }

          if (data['Released'] != 'N/A') {
            released = new Date(data['Released']); // 17 Jul 2015
          }

          if (data['Runtime'] != 'N/A') {
            runtime = data['Runtime']; // 117 min
            runtime = runtime.substring(0, runtime.length - 4);
          }

          if (data['Plot'] != 'N/A') {
            plot = data['Plot'];
          }

          if (data['Poster'] != 'N/A') {
            poster = data['Poster'];
          }

          if (data['Genre'] != 'N/A') {
            asyncTotal++;
            console.log(asyncTotal);
            asyncGenere(data['Genre']);
          }
          if (data['Director'] != 'N/A') {
            asyncTotal++;
            console.log(asyncTotal);
            asyncDirector(data['Director']);
          }
          if (data['Actors'] != 'N/A') {
            asyncTotal++;
            console.log(asyncTotal);
            asyncActor(data['Actors']);
          }
          if (data['Country'] != 'N/A') {
            asyncTotal++;
            console.log(asyncTotal);
            asyncCountry(data['Country']);
          }
        }
      }
    });
  };

  var save = function () {
    asyncTotal--;
    if (asyncTotal == 0) {

      req.app.db.models.Index.findOne({ 'name': 'Movie' }).exec(function(err, rsID) {
        var newM = new req.app.db.models.Movie({
          title: {
            russian: "",
            original: title
          },
          genre: genre,
          country: country,
          director: director,
          actors: actors,
          runtime: runtime,
          year: year,
          released: released,
          plot: plot,
          imdbID: imdbID,
          dateUpdate: new Date(),
          poster: null,
          sID: rsID['sID'],
          search: ""
        });
        newM.save(function (err, r) {
          if (err) {
            console.log('e1');
            console.log(err);
            return false;
          }

          if (poster != null) {
            if (r['year'] == null) {
              year = 'NoneYear';
            } else {
              year = r['year'];
            }
            var dir = 'public/posters/'+year+'/';
            var path = dir+r['_id']+'.jpg';

            var rr = request(poster);
            rr.on('response',  function (img) {
              if (!fs.existsSync(dir)){
                fs.mkdirSync(dir);
              }
              img.pipe(fs.createWriteStream(req.app.locals.rootPath+path));
              req.app.db.models.Movie.findByIdAndUpdate(r['_id'], {'poster': '/posters/'+year+'/'+r['_id']+'.jpg'}, function (err, r) {
                return res.redirect('/movie/'+r['sID']+'/');
              });
            });
          } else {
            return res.redirect('/movie/'+r['sID']+'/');
          }
        });
      });
    }
  };

  var asyncGenere = function (data) {
    async.eachSeries(data.split(', '), function(g, callback) {
      req.app.db.models.Genre.findOne({ 'name.original': g }).exec(function(err, r) {

        console.log(g);
        if (r == null) {
          console.log(g);

          req.app.db.models.Index.findOne({ 'name': 'Genre' }).exec(function(err, rsID) {
            var newG = new req.app.db.models.Genre({
              name: {
                russian: g,
                original: g
              },
              sID: rsID['sID']
            });
            newG.save(function (err, r) {
              if (err) {
                console.log('e2');
                console.log(err);
                return false;
              }
              console.log('e2');
              genre.push(r['_id']);
              callback();
            });
          });
        } else {
          genre.push(r['_id']);
          callback();
        }
      });
    }, function(err) {
      if (err) {
        console.log('e3');
        console.log(err);
        return false;
      }

      save();
    });
  };

  var asyncDirector = function (data) {
    async.eachSeries(data.split(', '), function(d, callback) {
      req.app.db.models.Director.findOne({ 'name.original': d }).exec(function(err, r) {
        if (r == null) {
          req.app.db.models.Index.findOne({ 'name': 'Director' }).exec(function(err, rsID) {
            var newD = new req.app.db.models.Director({
              name: {
                russian: d,
                original: d
              },
              sID: rsID['sID']
            });
            newD.save(function (err, r) {
              if (err) {
                console.log('e6');
                console.log(err);
                return false;
              }
              director.push(r['_id']);
              callback();
            });
          });
        } else {
          director.push(r['_id']);
          callback();
        }
      });
    }, function(err) {
      if (err) {
        console.log('e5');
        console.log(err);
        return false;
      }

      save();
    });
  };

  var asyncActor = function (data) {
    async.eachSeries(data.split(', '), function(a, callback) {
      req.app.db.models.Actor.findOne({ 'name.original': a }).exec(function(err, r) {
        if (r == null) {
          req.app.db.models.Index.findOne({ 'name': 'Actor' }).exec(function(err, rsID) {
            var newA = new req.app.db.models.Actor({
              name: {
                russian: a,
                original: a
              },
              sID: rsID['sID']
            });
            newA.save(function (err, r) {
              if (err) {
                console.log('e6');
                console.log(err);
                return false;
              }
              actors.push(r['_id']);
              callback();
            });
          });
        } else {
          actors.push(r['_id']);
          callback();
        }
      });
    }, function(err) {
      if (err) {
        console.log('e7');
        console.log(err);
        return false;
      }

      save();
    });
  };

  var asyncCountry = function (data) {
    async.eachSeries(data.split(', '), function(c, callback) {
      req.app.db.models.Country.findOne({ 'name.original': c }).exec(function(err, r) {
        if (r == null) {
          req.app.db.models.Index.findOne({ 'name': 'Country' }).exec(function(err, rsID) {
            var newC = new req.app.db.models.Country({
              name: {
                russian: c,
                original: c
              },
              sID: rsID['sID']
            });
            newC.save(function (err, r) {
              if (err) {
                console.log('e8');
                console.log(err);
                return false;
              }
              country.push(r['_id']);
              callback();
            });
          });
        } else {
          country.push(r['_id']);
          callback();
        }
      });
    }, function(err) {
      if (err) {
        console.log('e9');
        console.log(err);
        return false;
      }

      save();
    });
  };

  validateMovie();
};
