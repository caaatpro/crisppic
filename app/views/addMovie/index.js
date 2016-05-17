'use strict';

exports.init = function(req, res, next){
  var workflow = req.app.utility.workflow(req, res);
  var sigma = {};
  res.render('addMovie/index', sigma);
};
