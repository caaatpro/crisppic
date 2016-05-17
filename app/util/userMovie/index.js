'use strict';

exports.addViews = function(req, res, next){
  var workflow = req.app.utility.workflow(req, res);

  var sID = parseInt(req.body.sID || ''),
      date,
      movie;

  if (isNaN(sID)) {
    workflow.outcome.errors.push('Resource not found.');
    return workflow.emit('response');
  }

  try {
    date = new Date(req.body.date || '');
  }
  catch(e) {
    workflow.outcome.errors.push('Invalid date.');
    return workflow.emit('response');
  }

  req.app.db.models.Movie.findOne({ 'sID': sID }).populate('actors').populate('director').exec(function(err, r) {
    if (err || r == null) {
      workflow.outcome.errors.push('Resource not found.');
      return workflow.emit('response');
    } else {
      movie = r;

      addViews();
      userViewsTime();
      userViewsCount();
      userActorsCount();
      userDirectorsCount();
      movieViewsCount();
    }
  });

  var endReturn = function() {
    return workflow.emit('response');
  };

  // добавить запись в просмотры
  var addViews = function() {
    var fieldsToSet = {
      userId: req.user.id,
      movieId: movie['_id'],
      date: date,
      view: true
    };

    req.app.db.models.UserMovie.create(fieldsToSet, function(err) {
      if (err) {
        console.log(err);
      }
      endReturn();
    });
  };

  // увеличиваем время пользователя
  var userViewsTime = function() {
    req.app.db.models.User.findByIdAndUpdate(req.user.id, { $inc: { 'total.time': movie['runtime'] }}, function(err) {
      if (err) {
        console.log(err);
      }
      endReturn();
    });
  };

  // увеличиваем просмотры пользователя
  var userViewsCount = function() {
    req.app.db.models.User.findByIdAndUpdate(req.user.id, { $inc: { 'total.views': 1 }}, function(err) {
      if (err) {
        console.log(err);
      }
      endReturn();
    });
  };

  var userActorsCount = function() {
    // TODO перечитать актёров пользователя
  };

  var userDirectorsCount = function() {
    // TODO перечитать режисёров пользователя
  };

  // увеличиваем просмотры фильма
  var movieViewsCount = function() {
  };

};


exports.addWishlist = function(req, res, next){
  // TODO добавить запись в хочу посотреть


  var movieWishlistCount = function() {
    // TODO перечитать хочу фильма
  };

  var userWishlistCount = function() {
    // TODO перечитать хочу пользователя
  };
};
