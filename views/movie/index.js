'use strict';

exports.init = function(req, res, next){
  var workflow = req.app.utility.workflow(req, res);
  var sigma = {};

  var url = req.url.split('/');
  var sID = parseInt(url[2]);
  var movieId;

  workflow.on('movieUserList', function() {
    req.app.db.models.UserMovie.find({ 'userId': req.user.id, 'movieId': movieId }).exec(function(err, userList) {
      var date;
      for (var i = 0; i < userList.length; i++) {
        if (userList[i]['date']) {
          date = new Date(userList[i]['date']);
          userList[i]['dateF'] = req.app.utility.dateFormat(movie['date'], "d mmmm yyyy");
        } else {
          userList[i]['dateF'] = "Не указана";
        }
      }

      sigma['userList'] = userList;

      res.render('movie/index', sigma);
    });
  });

  // Получение информации о фильме
  workflow.on('movieGetMovieInfo', function() {
    req.app.db.models.Movie.findOne({ 'sID': sID }).populate('genre').populate('country').populate('actors').populate('director').exec(function(err, movie) {
      if (err || movie == null) {
        res.status(404);
        if (req.xhr) {
          return res.send({ error: 'Resource not found.' });
        }
        else {
          return res.render('http/404');
        }
      }

      if (movie['title']['russian'] == '') {
        movie['title']['russian'] = movie['title']['original'];
        movie['title']['original'] = '';
      }

      if (movie['poster'] == null) {
        movie['poster'] = '/images/no-poster.jpg';
      }

      if (movie['released'] != null) {
        movie['dateF'] = req.app.utility.dateFormat(movie['released'], "d mmmm yyyy");
      } else {
        movie['dateF'] = '-';
      }

      if (movie['year'] == null) {
        movie['year'] = '-';
      }

      sigma['item'] = movie;

      movieId = movie['_id'];
      workflow.emit('movieUserList');
    });
  });

  if (isNaN(sID)) {
    res.status(404);
    if (req.xhr) {
      res.send({ error: 'Resource not found.' });
    }
    else {
      res.render('http/404');
    }
    return next();
  } else {
    workflow.emit('movieGetMovieInfo');
  }
};

exports.AddView = function(req, res){
  var workflow = req.app.utility.workflow(req, res);

  var url = req.url.split('/');
  var sID = parseInt(url[2]);

  var movieId;

  // Получение информации о фильме
  workflow.on('movieGetMovieInfo', function() {
    req.app.db.models.Movie.findOne({ 'sID': sID }).populate('genre').exec(function(err, movie) {
      if (err || movie == null) {
        workflow.outcome.errors.push('Resource not found.');
        return workflow.emit('response');
      }

      movieId = movie['_id'];
      workflow.emit('movieAddView');
    });
  });

  // Добавление просмотра
  workflow.on('movieAddView', function() {
    var date = null;
    if (req.body.viewDate != '') {
      date = new Date(req.body.viewDate);
    }

    var comment = req.body.viewComment || '';

    var fieldsToSet = {
      userId: req.user.id,
      movieId: movieId,
      date: date,
      comment: comment,
      view: false
    };

    req.app.db.models.UserMovie.create(fieldsToSet, function(err) {
      if (err) {
        workflow.outcome.errors.push('Error.');
      }
      return workflow.emit('response');
    });
  });

  if (isNaN(sID)) {
    workflow.outcome.errors.push('Resource not found.');
    return workflow.emit('response');
  } else {
    workflow.emit('movieGetMovieInfo');
  }
};
