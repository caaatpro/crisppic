'use strict';

exports.init = function(req, res){
  if (req.user && req.user.username) {
    res.render('index');
  } else {
    res.render('index2');
  }
};
