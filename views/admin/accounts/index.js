'use strict';

exports.find = function(req, res, next){
  var outcome = {};

  var getResults = function(callback) {
    req.query.search = req.query.search ? req.query.search : '';
    req.query.limit = req.query.limit ? parseInt(req.query.limit, null) : 20;
    req.query.page = req.query.page ? parseInt(req.query.page, null) : 1;
    req.query.sort = req.query.sort ? req.query.sort : '_id';

    var filters = {};
    if (req.query.search) {
      filters.search = new RegExp('^.*?'+ req.query.search +'.*$', 'i');
    }

    req.app.db.models.Account.pagedFind({
      filters: filters,
      keys: 'name userCreated',
      limit: req.query.limit,
      page: req.query.page,
      sort: req.query.sort
    }, function(err, results) {
      if (err) {
        return callback(err, null);
      }

      outcome.results = results;
      return callback(null, 'done');
    });
  };

<<<<<<< HEAD
  var asyncFinally = function(err) {
=======
  var asyncFinally = function(err, results) {
>>>>>>> d8e7b97b87c84f50f2d7db2acecf4bfb0a344446
    if (err) {
      return next(err);
    }

    if (req.xhr) {
      res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
      outcome.results.filters = req.query;
      res.send(outcome.results);
    }
    else {
      outcome.results.filters = req.query;
      res.render('admin/accounts/index', {
        data: {
          results: escape(JSON.stringify(outcome.results)),
          status: outcome.status
        }
      });
    }
  };

  require('async').parallel([getResults], asyncFinally);
};

exports.read = function(req, res, next){
  var outcome = {};
  var getRecord = function(callback) {
    req.app.db.models.Account.findById(req.params.id).exec(function(err, record) {
      if (err) {
        return callback(err, null);
      }

      outcome.record = record;
      return callback(null, 'done');
    });
  };

<<<<<<< HEAD
  var asyncFinally = function(err) {
=======
  var asyncFinally = function(err, results) {
>>>>>>> d8e7b97b87c84f50f2d7db2acecf4bfb0a344446
    if (err) {
      return next(err);
    }

    if (req.xhr) {
      res.send(outcome.record);
    }
    else {
      res.render('admin/accounts/details', {
        data: {
          record: escape(JSON.stringify(outcome.record)),
          status: outcome.status
        }
      });
    }
  };

  require('async').parallel([getRecord], asyncFinally);
};

<<<<<<< HEAD
exports.create = function(req, res){
=======
exports.create = function(req, res, next){
>>>>>>> d8e7b97b87c84f50f2d7db2acecf4bfb0a344446
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function() {
    if (!req.body['name.full']) {
      workflow.outcome.errors.push('Please enter a name.');
      return workflow.emit('response');
    }

    workflow.emit('createAccount');
  });

  workflow.on('createAccount', function() {
    var nameParts = req.body['name.full'].trim().split(/\s/);
    var fieldsToSet = {
      name: {
        first: nameParts.shift(),
<<<<<<< HEAD
        last: (nameParts.length === 0 ? '' : nameParts.join(' '))
=======
        last: (nameParts.length === 0 ? '' : nameParts.join(' ')),
>>>>>>> d8e7b97b87c84f50f2d7db2acecf4bfb0a344446
      },
      userCreated: {
        id: req.user._id,
        name: req.user.username,
        time: new Date().toISOString()
      }
    };
    fieldsToSet.name.full = fieldsToSet.name.first + (fieldsToSet.name.last ? ' '+ fieldsToSet.name.last : '');
    fieldsToSet.search = [
      fieldsToSet.name.first,
      fieldsToSet.name.last
    ];

    req.app.db.models.Account.create(fieldsToSet, function(err, account) {
      if (err) {
        return workflow.emit('exception', err);
      }

      workflow.outcome.record = account;
      return workflow.emit('response');
    });
  });

  workflow.emit('validate');
};

<<<<<<< HEAD
exports.update = function(req, res){
=======
exports.update = function(req, res, next){
>>>>>>> d8e7b97b87c84f50f2d7db2acecf4bfb0a344446
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function() {
    if (!req.body.first) {
      workflow.outcome.errfor.first = 'required';
    }

    if (!req.body.last) {
      workflow.outcome.errfor.last = 'required';
    }

    if (workflow.hasErrors()) {
      return workflow.emit('response');
    }

    workflow.emit('patchAccount');
  });

  workflow.on('patchAccount', function() {
    var fieldsToSet = {
      name: {
        first: req.body.first,
        last: req.body.last,
        full: req.body.first +' '+ req.body.last
      },
      search: [
        req.body.first,
        req.body.last
      ]
    };

    req.app.db.models.Account.findByIdAndUpdate(req.params.id, fieldsToSet, function(err, account) {
      if (err) {
        return workflow.emit('exception', err);
      }

      workflow.outcome.account = account;
      return workflow.emit('response');
    });
  });

  workflow.emit('validate');
};

<<<<<<< HEAD
exports.linkUser = function(req, res){
=======
exports.linkUser = function(req, res, next){
>>>>>>> d8e7b97b87c84f50f2d7db2acecf4bfb0a344446
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function() {
    if (!req.user.roles.admin.isMemberOf('root')) {
      workflow.outcome.errors.push('You may not link accounts to users.');
      return workflow.emit('response');
    }

    if (!req.body.newUsername) {
      workflow.outcome.errfor.newUsername = 'required';
      return workflow.emit('response');
    }

    workflow.emit('verifyUser');
  });

<<<<<<< HEAD
  workflow.on('verifyUser', function() {
=======
  workflow.on('verifyUser', function(callback) {
>>>>>>> d8e7b97b87c84f50f2d7db2acecf4bfb0a344446
    req.app.db.models.User.findOne({ username: req.body.newUsername }).exec(function(err, user) {
      if (err) {
        return workflow.emit('exception', err);
      }

      if (!user) {
        workflow.outcome.errors.push('User not found.');
        return workflow.emit('response');
      }
      else if (user.roles && user.roles.account && user.roles.account !== req.params.id) {
        workflow.outcome.errors.push('User is already linked to a different account.');
        return workflow.emit('response');
      }

      workflow.user = user;
      workflow.emit('duplicateLinkCheck');
    });
  });

<<<<<<< HEAD
  workflow.on('duplicateLinkCheck', function() {
=======
  workflow.on('duplicateLinkCheck', function(callback) {
>>>>>>> d8e7b97b87c84f50f2d7db2acecf4bfb0a344446
    req.app.db.models.Account.findOne({ 'user.id': workflow.user._id, _id: {$ne: req.params.id} }).exec(function(err, account) {
      if (err) {
        return workflow.emit('exception', err);
      }

      if (account) {
        workflow.outcome.errors.push('Another account is already linked to that user.');
        return workflow.emit('response');
      }

      workflow.emit('patchUser');
    });
  });

  workflow.on('patchUser', function() {
<<<<<<< HEAD
    req.app.db.models.User.findByIdAndUpdate(workflow.user._id, { 'roles.account': req.params.id }).exec(function(err) {
=======
    req.app.db.models.User.findByIdAndUpdate(workflow.user._id, { 'roles.account': req.params.id }).exec(function(err, user) {
>>>>>>> d8e7b97b87c84f50f2d7db2acecf4bfb0a344446
      if (err) {
        return workflow.emit('exception', err);
      }

      workflow.emit('patchAccount');
    });
  });

<<<<<<< HEAD
  workflow.on('patchAccount', function() {
=======
  workflow.on('patchAccount', function(callback) {
>>>>>>> d8e7b97b87c84f50f2d7db2acecf4bfb0a344446
    req.app.db.models.Account.findByIdAndUpdate(req.params.id, { user: { id: workflow.user._id, name: workflow.user.username } }).exec(function(err, account) {
      if (err) {
        return workflow.emit('exception', err);
      }

      workflow.outcome.account = account;
      workflow.emit('response');
    });
  });

  workflow.emit('validate');
};

<<<<<<< HEAD
exports.unlinkUser = function(req, res){
=======
exports.unlinkUser = function(req, res, next){
>>>>>>> d8e7b97b87c84f50f2d7db2acecf4bfb0a344446
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function() {
    if (!req.user.roles.admin.isMemberOf('root')) {
      workflow.outcome.errors.push('You may not unlink users from accounts.');
      return workflow.emit('response');
    }

    workflow.emit('patchAccount');
  });

  workflow.on('patchAccount', function() {
    req.app.db.models.Account.findById(req.params.id).exec(function(err, account) {
      if (err) {
        return workflow.emit('exception', err);
      }

      if (!account) {
        workflow.outcome.errors.push('Account was not found.');
        return workflow.emit('response');
      }

      var userId = account.user.id;
      account.user = { id: undefined, name: '' };
      account.save(function(err, account) {
        if (err) {
          return workflow.emit('exception', err);
        }

        workflow.outcome.account = account;
        workflow.emit('patchUser', userId);
      });
    });
  });

  workflow.on('patchUser', function(id) {
    req.app.db.models.User.findById(id).exec(function(err, user) {
      if (err) {
        return workflow.emit('exception', err);
      }

      if (!user) {
        workflow.outcome.errors.push('User was not found.');
        return workflow.emit('response');
      }

      user.roles.account = undefined;
<<<<<<< HEAD
      user.save(function(err) {
=======
      user.save(function(err, user) {
>>>>>>> d8e7b97b87c84f50f2d7db2acecf4bfb0a344446
        if (err) {
          return workflow.emit('exception', err);
        }

        workflow.emit('response');
      });
    });
  });

  workflow.emit('validate');
};

<<<<<<< HEAD
exports.delete = function(req, res){
=======
exports.delete = function(req, res, next){
>>>>>>> d8e7b97b87c84f50f2d7db2acecf4bfb0a344446
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function() {
    if (!req.user.roles.admin.isMemberOf('root')) {
      workflow.outcome.errors.push('You may not delete accounts.');
      return workflow.emit('response');
    }

    workflow.emit('deleteAccount');
  });

<<<<<<< HEAD
  workflow.on('deleteAccount', function() {
=======
  workflow.on('deleteAccount', function(err) {
>>>>>>> d8e7b97b87c84f50f2d7db2acecf4bfb0a344446
    req.app.db.models.Account.findByIdAndRemove(req.params.id, function(err, account) {
      if (err) {
        return workflow.emit('exception', err);
      }

      workflow.outcome.account = account;
      workflow.emit('response');
    });
  });

  workflow.emit('validate');
};
