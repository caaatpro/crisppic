'use strict';

exports.init = function(req, res){
  var workflow = req.app.utility.workflow(req, res);
  var sigma = {};

  var url = req.url.split('/');
  var username = url[2];


  workflow.on('movieUserList', function() {
    req.app.db.models.UserMovie.find({ 'userId': sigma['account']['_id'] }).limit(10).populate('movieId').exec(function(err, accountList) {
      var date;
      for (var i = 0; i < accountList.length; i++) {
        if (accountList[i]['date']) {
          date = new Date(accountList[i]['date']);
          accountList[i]['date_format'] = date.getDate() + '.' + date.getMonth() + '.' + date.getYear();
        } else {
          accountList[i]['date_format'] = "-";
        }
      }

      sigma['accountList'] = accountList;

      workflow.emit('accountInit');
    });
  });

  workflow.on('accountInfo', function() {
    console.log(username);
    req.app.db.models.User.findOne({'username': username}).populate('roles.account', 'name.full').exec(function(err, account) {
      if (err || account == null) {
        res.status(404);
        if (req.xhr) {
          return res.send({ error: 'Resource not found.' });
        }
        else {
          return res.render('http/404');
        }
      }

      sigma['account'] = account;

      workflow.emit('movieUserList');
    });
  });

  workflow.on('accountInit', function() {
    res.render('account/index', sigma);
  });

  workflow.emit('accountInfo');
};
