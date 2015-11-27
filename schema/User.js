'use strict';

exports = module.exports = function(app, mongoose) {
  var userSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: String,
    email: { type: String, unique: true },
    roles: {
      admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
      account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' }
    },
    isActive: String,
    timeCreated: { type: Date, default: Date.now },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    twitter: {},
    facebook: {},
    google: {},
    search: [String]
  });
  userSchema.methods.canPlayRoleOf = function(role) {
    if (role === "admin" && this.roles.admin) {
      return true;
    }

<<<<<<< HEAD
    return !!(role === "account" && this.roles.account);


=======
    if (role === "account" && this.roles.account) {
      return true;
    }

    return false;
>>>>>>> d8e7b97b87c84f50f2d7db2acecf4bfb0a344446
  };
  userSchema.methods.defaultReturnUrl = function() {
    var returnUrl = '/';
    if (this.canPlayRoleOf('account')) {
<<<<<<< HEAD
      returnUrl = '/account/' + this.username;
=======
      returnUrl = '/account/';
>>>>>>> d8e7b97b87c84f50f2d7db2acecf4bfb0a344446
    }

    if (this.canPlayRoleOf('admin')) {
      returnUrl = '/admin/';
    }

    return returnUrl;
  };
  userSchema.statics.encryptPassword = function(password, done) {
<<<<<<< HEAD
    var bcrypt = require('bcryptjs');
=======
    var bcrypt = require('bcrypt');
>>>>>>> d8e7b97b87c84f50f2d7db2acecf4bfb0a344446
    bcrypt.genSalt(10, function(err, salt) {
      if (err) {
        return done(err);
      }

      bcrypt.hash(password, salt, function(err, hash) {
        done(err, hash);
      });
    });
  };
  userSchema.statics.validatePassword = function(password, hash, done) {
<<<<<<< HEAD
    var bcrypt = require('bcryptjs');
=======
    var bcrypt = require('bcrypt');
>>>>>>> d8e7b97b87c84f50f2d7db2acecf4bfb0a344446
    bcrypt.compare(password, hash, function(err, res) {
      done(err, res);
    });
  };
  userSchema.plugin(require('./plugins/pagedFind'));
  userSchema.index({ username: 1 }, { unique: true });
  userSchema.index({ email: 1 }, { unique: true });
  userSchema.index({ timeCreated: 1 });
  userSchema.index({ 'twitter.id': 1 });
<<<<<<< HEAD
=======
  userSchema.index({ 'github.id': 1 });
>>>>>>> d8e7b97b87c84f50f2d7db2acecf4bfb0a344446
  userSchema.index({ 'facebook.id': 1 });
  userSchema.index({ 'google.id': 1 });
  userSchema.index({ search: 1 });
  userSchema.set('autoIndex', (app.get('env') === 'development'));
  app.db.model('User', userSchema);
};
