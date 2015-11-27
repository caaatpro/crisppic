'use strict';

exports.find = function(req, res, next){
  req.query.search = req.query.search ? req.query.search : '';
  req.query.limit = req.query.limit ? parseInt(req.query.limit, null) : 20;
  req.query.page = req.query.page ? parseInt(req.query.page, null) : 1;
  req.query.sort = req.query.sort ? req.query.sort : '_id';

  var filters = {};
  if (req.query.search) {
    filters.search = new RegExp('^.*?'+ req.query.search +'.*$', 'i');
  }

  req.app.db.models.Admin.pagedFind({
    filters: filters,
    keys: 'name.full',
    limit: req.query.limit,
    page: req.query.page,
    sort: req.query.sort
  }, function(err, results) {
    if (err) {
      return next(err);
    }

    if (req.xhr) {
      res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
      results.filters = req.query;
      res.send(results);
    }
    else {
      results.filters = req.query;
      res.render('admin/administrators/index', { data: { results: escape(JSON.stringify(results)) } });
    }
  });
};

exports.read = function(req, res, next){
  var outcome = {};

  var getAdminGroups = function(callback) {
    req.app.db.models.AdminGroup.find({}, 'name').sort('name').exec(function(err, adminGroups) {
      if (err) {
        return callback(err, null);
      }

      outcome.adminGroups = adminGroups;
      return callback(null, 'done');
    });
  };

  var getRecord = function(callback) {
    req.app.db.models.Admin.findById(req.params.id).populate('groups', 'name').exec(function(err, record) {
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
      res.render('admin/administrators/details', {
        data: {
          record: escape(JSON.stringify(outcome.record)),
          adminGroups: outcome.adminGroups
        }
      });
    }
  };

  require('async').parallel([getAdminGroups, getRecord], asyncFinally);
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

    workflow.emit('createAdministrator');
  });

  workflow.on('createAdministrator', function() {
    var nameParts = req.body['name.full'].trim().split(/\s/);
    var fieldsToSet = {
      name: {
        first: nameParts.shift(),
        middle: (nameParts.length > 1 ? nameParts.shift() : ''),
<<<<<<< HEAD
        last: (nameParts.length === 0 ? '' : nameParts.join(' '))
=======
        last: (nameParts.length === 0 ? '' : nameParts.join(' ')),
>>>>>>> d8e7b97b87c84f50f2d7db2acecf4bfb0a344446
      }
    };
    fieldsToSet.name.full = fieldsToSet.name.first + (fieldsToSet.name.last ? ' '+ fieldsToSet.name.last : '');
    fieldsToSet.search = [
      fieldsToSet.name.first,
      fieldsToSet.name.middle,
      fieldsToSet.name.last
    ];

    req.app.db.models.Admin.create(fieldsToSet, function(err, admin) {
      if (err) {
        return workflow.emit('exception', err);
      }

      workflow.outcome.record = admin;
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

    workflow.emit('patchAdministrator');
  });

  workflow.on('patchAdministrator', function() {
    var fieldsToSet = {
      name: {
        first: req.body.first,
        middle: req.body.middle,
        last: req.body.last,
        full: req.body.first +' '+ req.body.last
      },
      search: [
        req.body.first,
        req.body.middle,
        req.body.last
      ]
    };

    req.app.db.models.Admin.findByIdAndUpdate(req.params.id, fieldsToSet, function(err, admin) {
      if (err) {
        return workflow.emit('exception', err);
      }

      admin.populate('groups', 'name', function(err, admin) {
        if (err) {
          return workflow.emit('exception', err);
        }

        workflow.outcome.admin = admin;
        workflow.emit('response');
      });
    });
  });

  workflow.emit('validate');
};

<<<<<<< HEAD
exports.groups = function(req, res){
=======
exports.groups = function(req, res, next){
>>>>>>> d8e7b97b87c84f50f2d7db2acecf4bfb0a344446
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function() {
    if (!req.user.roles.admin.isMemberOf('root')) {
      workflow.outcome.errors.push('You may not change the group memberships of admins.');
      return workflow.emit('response');
    }

    if (!req.body.groups) {
      workflow.outcome.errfor.groups = 'required';
      return workflow.emit('response');
    }

    workflow.emit('patchAdministrator');
  });

  workflow.on('patchAdministrator', function() {
    var fieldsToSet = {
      groups: req.body.groups
    };

    req.app.db.models.Admin.findByIdAndUpdate(req.params.id, fieldsToSet, function(err, admin) {
      if (err) {
        return workflow.emit('exception', err);
      }

      admin.populate('groups', 'name', function(err, admin) {
        if (err) {
          return workflow.emit('exception', err);
        }

        workflow.outcome.admin = admin;
        workflow.emit('response');
      });
    });
  });

  workflow.emit('validate');
};

<<<<<<< HEAD
exports.permissions = function(req, res){
=======
exports.permissions = function(req, res, next){
>>>>>>> d8e7b97b87c84f50f2d7db2acecf4bfb0a344446
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function() {
    if (!req.user.roles.admin.isMemberOf('root')) {
      workflow.outcome.errors.push('You may not change the permissions of admins.');
      return workflow.emit('response');
    }

    if (!req.body.permissions) {
      workflow.outcome.errfor.permissions = 'required';
      return workflow.emit('response');
    }

    workflow.emit('patchAdministrator');
  });

  workflow.on('patchAdministrator', function() {
    var fieldsToSet = {
      permissions: req.body.permissions
    };

    req.app.db.models.Admin.findByIdAndUpdate(req.params.id, fieldsToSet, function(err, admin) {
      if (err) {
        return workflow.emit('exception', err);
      }

      admin.populate('groups', 'name', function(err, admin) {
        if (err) {
          return workflow.emit('exception', err);
        }

        workflow.outcome.admin = admin;
        workflow.emit('response');
      });
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
      workflow.outcome.errors.push('You may not link admins to users.');
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
    req.app.db.models.User.findOne({ username: req.body.newUsername }, 'username').exec(function(err, user) {
      if (err) {
        return workflow.emit('exception', err);
      }

      if (!user) {
        workflow.outcome.errors.push('User not found.');
        return workflow.emit('response');
      }
      else if (user.roles && user.roles.admin && user.roles.admin !== req.params.id) {
        workflow.outcome.errors.push('User is already linked to a different admin.');
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
    req.app.db.models.Admin.findOne({ 'user.id': workflow.user._id, _id: { $ne: req.params.id } }).exec(function(err, admin) {
      if (err) {
        return workflow.emit('exception', err);
      }

      if (admin) {
        workflow.outcome.errors.push('Another admin is already linked to that user.');
        return workflow.emit('response');
      }

      workflow.emit('patchUser');
    });
  });

  workflow.on('patchUser', function() {
<<<<<<< HEAD
    req.app.db.models.User.findByIdAndUpdate(workflow.user._id, { 'roles.admin': req.params.id }).exec(function(err) {
=======
    req.app.db.models.User.findByIdAndUpdate(workflow.user._id, { 'roles.admin': req.params.id }).exec(function(err, user) {
>>>>>>> d8e7b97b87c84f50f2d7db2acecf4bfb0a344446
      if (err) {
        return workflow.emit('exception', err);
      }
      workflow.emit('patchAdministrator');
    });
  });

<<<<<<< HEAD
  workflow.on('patchAdministrator', function() {
=======
  workflow.on('patchAdministrator', function(callback) {
>>>>>>> d8e7b97b87c84f50f2d7db2acecf4bfb0a344446
    req.app.db.models.Admin.findByIdAndUpdate(req.params.id, { user: { id: workflow.user._id, name: workflow.user.username } }).exec(function(err, admin) {
      if (err) {
        return workflow.emit('exception', err);
      }

      admin.populate('groups', 'name', function(err, admin) {
        if (err) {
          return workflow.emit('exception', err);
        }

        workflow.outcome.admin = admin;
        workflow.emit('response');
      });
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
      workflow.outcome.errors.push('You may not unlink users from admins.');
      return workflow.emit('response');
    }

    if (req.user.roles.admin._id === req.params.id) {
      workflow.outcome.errors.push('You may not unlink yourself from admin.');
      return workflow.emit('response');
    }

    workflow.emit('patchAdministrator');
  });

  workflow.on('patchAdministrator', function() {
    req.app.db.models.Admin.findById(req.params.id).exec(function(err, admin) {
      if (err) {
        return workflow.emit('exception', err);
      }

      if (!admin) {
        workflow.outcome.errors.push('Administrator was not found.');
        return workflow.emit('response');
      }

      var userId = admin.user.id;
      admin.user = { id: undefined, name: ''};
      admin.save(function(err, admin) {
        if (err) {
          return workflow.emit('exception', err);
        }

        admin.populate('groups', 'name', function(err, admin) {
          if (err) {
            return workflow.emit('exception', err);
          }

          workflow.outcome.admin = admin;
          workflow.emit('patchUser', userId);
        });
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

      user.roles.admin = undefined;
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
      workflow.outcome.errors.push('You may not delete admins.');
      return workflow.emit('response');
    }

    if (req.user.roles.admin._id === req.params.id) {
      workflow.outcome.errors.push('You may not delete your own admin record.');
      return workflow.emit('response');
    }

    workflow.emit('deleteAdministrator');
  });

<<<<<<< HEAD
  workflow.on('deleteAdministrator', function() {
    req.app.db.models.Admin.findByIdAndRemove(req.params.id, function(err) {
=======
  workflow.on('deleteAdministrator', function(err) {
    req.app.db.models.Admin.findByIdAndRemove(req.params.id, function(err, admin) {
>>>>>>> d8e7b97b87c84f50f2d7db2acecf4bfb0a344446
      if (err) {
        return workflow.emit('exception', err);
      }

      workflow.emit('response');
    });
  });

  workflow.emit('validate');
};
