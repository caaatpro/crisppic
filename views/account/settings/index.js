'use strict';

var renderSettings = function(req, res, next, oauthMessage) {
  var outcome = {};

  var getAccountData = function(callback) {
    req.app.db.models.Account.findById(req.user.roles.account.id, 'name').exec(function(err, account) {
      if (err) {
        return callback(err, null);
      }

      outcome.account = account;
      callback(null, 'done');
    });
  };

  var getUserData = function(callback) {
    req.app.db.models.User.findById(req.user.id, 'email sex twitter.id facebook.id google.id').exec(function(err, user) {
      if (err) {
        callback(err, null);
      }

      outcome.user = user;
      return callback(null, 'done');
    });
  };

  var asyncFinally = function(err) {
    if (err) {
      return next(err);
    }

    res.render('account/settings/index', {
      data: {
        account: outcome.account,
        user: outcome.user
      },
      oauthMessage: oauthMessage,
      oauthTwitter: !!req.app.config.oauth.twitter.key,
      oauthTwitterActive: outcome.user.twitter ? !!outcome.user.twitter.id : false,
      oauthFacebook: !!req.app.config.oauth.facebook.key,
      oauthFacebookActive: outcome.user.facebook ? !!outcome.user.facebook.id : false,
      oauthGoogle: !!req.app.config.oauth.google.key,
      oauthGoogleActive: outcome.user.google ? !!outcome.user.google.id : false
    });
  };

  require('async').parallel([getAccountData, getUserData], asyncFinally);
};

exports.init = function(req, res, next){
  renderSettings(req, res, next, '');
};

exports.connectTwitter = function(req, res, next){
  req._passport.instance.authenticate('twitter', function(err, user, info) {
    if (!info || !info.profile) {
      return res.redirect('/account/settings/');
    }

    req.app.db.models.User.findOne({ 'twitter.id': info.profile.id, _id: { $ne: req.user.id } }, function(err, user) {
      if (err) {
        return next(err);
      }

      if (user) {
        renderSettings(req, res, next, 'Another user has already connected with that Twitter account.');
      }
      else {
        req.app.db.models.User.findByIdAndUpdate(req.user.id, { 'twitter.id': info.profile.id }, function(err) {
          if (err) {
            return next(err);
          }

          res.redirect('/account/settings/');
        });
      }
    });
  })(req, res, next);
};

exports.connectFacebook = function(req, res, next){
  req._passport.instance.authenticate('facebook', { callbackURL: '/account/settings/facebook/callback/' }, function(err, user, info) {
    if (!info || !info.profile) {
      return res.redirect('/account/settings/');
    }

    req.app.db.models.User.findOne({ 'facebook.id': info.profile.id, _id: { $ne: req.user.id } }, function(err, user) {
      if (err) {
        return next(err);
      }

      if (user) {
        renderSettings(req, res, next, 'Another user has already connected with that Facebook account.');
      }
      else {
        req.app.db.models.User.findByIdAndUpdate(req.user.id, { 'facebook.id': info.profile.id }, function(err) {
          if (err) {
            return next(err);
          }

          res.redirect('/account/settings/');
        });
      }
    });
  })(req, res, next);
};

exports.connectGoogle = function(req, res, next){
  req._passport.instance.authenticate('google', { callbackURL: '/account/settings/google/callback/' }, function(err, user, info) {
    if (!info || !info.profile) {
      return res.redirect('/account/settings/');
    }

    req.app.db.models.User.findOne({ 'google.id': info.profile.id, _id: { $ne: req.user.id } }, function(err, user) {
      if (err) {
        return next(err);
      }

      if (user) {
        renderSettings(req, res, next, 'Another user has already connected with that Google account.');
      }
      else {
        req.app.db.models.User.findByIdAndUpdate(req.user.id, { 'google.id': info.profile.id }, function(err) {
          if (err) {
            return next(err);
          }

          res.redirect('/account/settings/');
        });
      }
    });
  })(req, res, next);
};

exports.disconnectTwitter = function(req, res, next){
  req.app.db.models.User.findByIdAndUpdate(req.user.id, { twitter: { id: undefined } }, function(err) {
    if (err) {
      return next(err);
    }

    res.redirect('/account/settings/');
  });
};

exports.disconnectFacebook = function(req, res, next){
  req.app.db.models.User.findByIdAndUpdate(req.user.id, { facebook: { id: undefined } }, function(err) {
    if (err) {
      return next(err);
    }

    res.redirect('/account/settings/');
  });
};

exports.disconnectGoogle = function(req, res, next){
  req.app.db.models.User.findByIdAndUpdate(req.user.id, { google: { id: undefined } }, function(err) {
    if (err) {
      return next(err);
    }

    res.redirect('/account/settings/');
  });
};

exports.save = function(req, res){
  req.app.utility.movieReindex.reindex(req, res);

  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validateEmail', function() {
    if (!req.body.email) {
      workflow.outcome.errfor.email = 'Email не указан';
    }
    else if (!/^[a-zA-Z0-9\-\_\.\+]+@[a-zA-Z0-9\-\_\.]+\.[a-zA-Z0-9\-\_]+$/.test(req.body.email)) {
      workflow.outcome.errfor.email = 'Неверный формат Email';
    }

    if (workflow.hasErrors()) {
      return workflow.emit('response');
    }

    workflow.emit('duplicateEmailCheck');
  });

  workflow.on('duplicateEmailCheck', function() {
    req.app.db.models.User.findOne({ email: req.body.email.toLowerCase(), _id: { $ne: req.user.id } }, function(err, user) {
      if (err) {
        return workflow.emit('exception', err);
      }

      if (user) {
        workflow.outcome.errfor.email = 'Email уже используется другим пользователем';
        return workflow.emit('response');
      }

      workflow.emit('sexCheck');
    });
  });

  workflow.on('sexCheck', function() {
    if (!req.body.sex) {
      workflow.outcome.errfor.sex = 'Пол не выбран';
    } else {
      if (req.body.sex != "0" && req.body.sex != "1") {
        workflow.outcome.errfor.sex = 'Пол не выбран';
      }
    }

    if (workflow.hasErrors()) {
      return workflow.emit('response');
    }
    workflow.emit('patchUser');
  });

  workflow.on('patchUser', function() {
    var fieldsToSet = {
      sex: req.body.sex,
      email: req.body.email.toLowerCase()
    };

    var options = { select: 'username email twitter.id facebook.id google.id' };

    req.app.db.models.User.findByIdAndUpdate(req.user.id, fieldsToSet, options, function(err) {
      if (err) {
        return workflow.emit('exception', err);
      }

      return workflow.emit('response');
    });
  });

  workflow.emit('validateEmail');
};

exports.password = function(req, res){
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function() {
    if (!req.body.password) {
      workflow.outcome.errfor.password = 'Пароль не указан';
    }

    if (workflow.hasErrors()) {
      return workflow.emit('response');
    }

    workflow.emit('patchUser');
  });

  workflow.on('patchUser', function() {
    req.app.db.models.User.encryptPassword(req.body.password, function(err, hash) {
      if (err) {
        return workflow.emit('exception', err);
      }

      var fieldsToSet = { password: hash };
      req.app.db.models.User.findByIdAndUpdate(req.user.id, fieldsToSet, function(err, user) {
        if (err) {
          return workflow.emit('exception', err);
        }

        workflow.emit('response');
      });
    });
  });

  workflow.emit('validate');
};
