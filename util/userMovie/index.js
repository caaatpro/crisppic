'use strict';

exports = module.exports = function(req, res) {
  var workflow = req.app.utility.workflow(req, res);


  var validateDate = function() {
    // TODO валидация даты
    workflow.outcome.errors.push('Invalid date.');
    return workflow.emit('response');
  };


  var validateMovie = function() {
    // TODO проверка существования фильма по sID
    req.app.db.models.Movie.findOne({ 'sID': sID }).populate('actors').populate('director').exec(function(err, r) {
      if (err || r == null) {
        workflow.outcome.errors.push('Resource not found.');
        return workflow.emit('response');
      } else {

      }
    });
  };

  var addViews = function() {
    // TODO добавить запись в просмотры
  };

  var userViewsTime = function() {
    // TODO перечитать время пользователя
  };

  var userViewsCount = function() {
    // TODO перечитать просмотры пользователя
  };

  var userActorsCount = function() {
    // TODO перечитать актёров пользователя
  };

  var userDirectorsCount = function() {
    // TODO перечитать режисёров пользователя
  };

  var userWishlistCount = function() {
    // TODO перечитать хочу пользователя
  };

  var movieViewsCount = function() {
    // TODO перечитать просмотры фильма
  };

  var movieWishlistCount = function() {
    // TODO перечитать хочу фильма
  };

  var addWishlist = function() {
    // TODO добавить запись в хочу посотреть
  };

};
