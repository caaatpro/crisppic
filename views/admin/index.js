'use strict';

exports.init = function(req, res, next){
  var sigma = {};
  var collections = ['User', 'Account', 'Admin', 'AdminGroup'];
  var queries = [];

<<<<<<< HEAD
  collections.forEach(function(el) {
=======
  collections.forEach(function(el, i, arr) {
>>>>>>> d8e7b97b87c84f50f2d7db2acecf4bfb0a344446
    queries.push(function(done) {
      req.app.db.models[el].count({}, function(err, count) {
        if (err) {
          return done(err, null);
        }

        sigma['count'+ el] = count;
        done(null, el);
      });
    });
  });

<<<<<<< HEAD
  var asyncFinally = function(err) {
=======
  var asyncFinally = function(err, results) {
>>>>>>> d8e7b97b87c84f50f2d7db2acecf4bfb0a344446
    if (err) {
      return next(err);
    }

    res.render('admin/index', sigma);
  };

  require('async').parallel(queries, asyncFinally);
};
