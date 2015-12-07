'use strict';

exports.init = function(req, res){
  var workflow = req.app.utility.workflow(req, res);
  var sigma = {};

  var url = req.url.split('/');
  var username = url[2];

  workflow.on('movieUserList', function() {
    req.app.db.models.UserMovie.find({ 'userId': sigma['account']['_id'] }).limit(1000).populate('movieId').exec(function(err, accountList) {
      var date;
      for (var i = 0; i < accountList.length; i++) {
        if (accountList[i]['date']) {
          accountList[i]['dateFormat'] = req.app.utility.dateFormat(accountList[i]['date'], "d mmmm yyyy");
        } else {
          accountList[i]['dateFormat'] = "-";
        }
      }

      sigma['accountList'] = accountList;

      workflow.emit('accountInit');
    });
  });

  workflow.on('accountInfo', function() {
    req.app.db.models.User.findOne({'username': username}).populate('roles.account').exec(function(err, account) {
      if (err || account == null) {
        res.status(404);
        if (req.xhr) {
          return res.send({ error: 'Resource not found.' });
        }
        else {
          return res.render('http/404');
        }
      }


      account['dateFormat'] = req.app.utility.dateFormat(account['timeCreated'], "d mmmm yyyy");

      sigma['account'] = account;

      workflow.emit('movieUserList');
    });
  });

  workflow.on('accountInit', function() {
    res.render('account/index', sigma);
  });

  workflow.emit('accountInfo');
};
