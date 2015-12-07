'use strict';

exports = module.exports = function(req, res) {
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
      poster = null,
      plot = "",
      title = "",
      title_ru = "",
      imdbID = "",

      filesPath = "/home/puh/www/crisppic.com/test",

      files = [],

      filesI = -1,

      asyncTotal = 0;

  var validateMovie = function() {
    req.app.db.models.Movie.findOne({ 'imdbID': imdbID }).exec(function(err, r) {
      if (r == null) {
        getMovie();
      } else {
        //return res.redirect('/movie/'+r['sID']+'/');
      }
    });
  };

  var getMovie = function() {
    fs.readdir(filesPath, function(err, items) {
      for (var i=0; i<items.length; i++) {
        if (items[i] == '404') continue;

        files.push(items[i])
      }

      read();
    });
  };

  var save = function () {
    asyncTotal--;
    console.log(asyncTotal);
    if (asyncTotal == 0) {
      console.log(asyncTotal);
      var newM = new req.app.db.models.Movie({
        title: {
          russian: title_ru,
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
        search: ""
      });
      newM.save(function (err, r) {
        if (err) {
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
              read();
              //return res.redirect('/movie/'+r['sID']+'/');
            });
          });
        } else {
          read();
          console.log(1);
        }
      });
    }
  };

  var read = function () {
    filesI++;
    genre = [];
    director = [];
    actors = [];
    country = [];
    year = null;
    released = null;
    runtime = 0;
    poster = null;
    plot = "";
    title = "";
    title_ru = "";
    asyncTotal = 0;

    fs.readFile(filesPath+'/'+files[filesI], 'utf8', function (err,body) {
      if (err) {
        return console.log(err);
      }

      try {
        var dataJSON = JSON.parse(body);
      } catch (e) {
        console.log('JSON read error');
        read();
        return false;
      }

      if (dataJSON['data']) {
        var dataJ = dataJSON['data'];
      } else {
        var dataJ = dataJSON;
      }

      req.app.db.models.Movie.findOne({ 'imdbID': dataJ['imdb_id'] }).exec(function(err, r) {
        if (r == null) {
          request('http://www.omdbapi.com/?i=' + dataJ['imdb_id'] + '&plot=full&r=json', function (error, response, body) {
            if (!error && response.statusCode == 200) {
              try {
                var data = JSON.parse(body);
              } catch (e) {
                console.log('JSON read error');
                read();
                return false;
              }

              if (data['Response'] == 'False' || dataJ['imdb_id'] == 'tt1008002') {
                console.log(dataJ['imdb_id']);
                console.log(data['Error']);
                read();
                return false;
              } else {
                if (data['Type'] != 'movie') {
                  console.log('Type not movie.');

                  read();
                  return false;
                }

                imdbID = dataJ['imdb_id'];

                console.log(data);

                title = data['Title'];

                if (data['Year'] != 'N/A') {
                  year = data['Year'];
                }

                if (data['Released'] != 'N/A') {
                  released = new Date(data['Released']); // 17 Jul 2015
                }

                if (data['Runtime'] != 'N/A') {
                  console.log(dataJ['imdb_id']);
                  runtime = data['Runtime']; // 117 min
                  if (runtime.indexOf(',') != -1) {
                    read();
                    return false;
                  }
                  if (runtime.indexOf('min') != -1) {
                    runtime = runtime.substring(0, runtime.length - 4);
                  }
                  if (runtime.indexOf('h') != -1) {
                    var t = runtime.split('h');
                    runtime = parseInt(t[0]) * 60;
                    if (t[1] != '') {
                      runtime = runtime+parseInt(t[0]);
                    }
                  }
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
        } else {
          console.log('Yes');
          read();
        }
      });
    });
  };

  var asyncGenere = function (data) {
    async.eachSeries(data.split(', '), function(g, callback) {
      req.app.db.models.Genre.findOne({ 'name.original': g }).exec(function(err, r) {
        if (r == null) {
          var newG = new req.app.db.models.Genre({
            name: {
              russian: g,
              original: g
            }
          });
          newG.save(function (err, r) {
            if (err) {
              console.log('Genre Save Error.');
              return false;
            }
            genre.push(r['_id']);
            callback();
          });
        } else {
          genre.push(r['_id']);
          callback();
        }
      });
    }, function(err) {
      if (err) {
        console.log('Genre Get Error.');
        return false;
      }

      console.log(asyncTotal);
      save();
    });
  };

  var asyncDirector = function (data) {
    async.eachSeries(data.split(', '), function(d, callback) {
      req.app.db.models.Director.findOne({ 'name.original': d }).exec(function(err, r) {
        if (r == null) {
          var newD = new req.app.db.models.Director({
            name: {
              russian: d,
              original: d
            }
          });
          newD.save(function (err, r) {
            if (err) {
              console.log('Director Save Error.');
              return false;
            }
            director.push(r['_id']);
            callback();
          });
        } else {
          director.push(r['_id']);
          callback();
        }
      });
    }, function(err) {
      if (err) {
        console.log('Director Get Error.');
        return false;
      }
      console.log(asyncTotal);
      save();
    });
  };

  var asyncActor = function (data) {
    async.eachSeries(data.split(', '), function(a, callback) {
      req.app.db.models.Actor.findOne({ 'name.original': a }).exec(function(err, r) {
        if (r == null) {
          var newA = new req.app.db.models.Actor({
            name: {
              russian: a,
              original: a
            }
          });
          newA.save(function (err, r) {
            if (err) {
              console.log('Actor Save Error.');
              return false;
            }
            actors.push(r['_id']);
            callback();
          });
        } else {
          actors.push(r['_id']);
          callback();
        }
      });
    }, function(err) {
      if (err) {
        console.log('Actor Get Error.');
        return false;
      }
      console.log(asyncTotal);

      save();
    });
  };

  var asyncCountry = function (data) {
    async.eachSeries(data.split(', '), function(c, callback) {
      req.app.db.models.Country.findOne({ 'name.original': c }).exec(function(err, r) {
        if (r == null) {
          var newC = new req.app.db.models.Country({
            name: {
              russian: c,
              original: c
            }
          });
          newC.save(function (err, r) {
            if (err) {
              console.log('Country Save Error.');
              return false;
            }
            country.push(r['_id']);
            callback();
          });
        } else {
          country.push(r['_id']);
          callback();
        }
      });
    }, function(err) {
      if (err) {
        console.log('Country Get Error.');
        return false;
      }

      console.log(asyncTotal);
      save();
    });
  };

  getMovie();
};
