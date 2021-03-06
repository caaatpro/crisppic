'use strict';

exports = module.exports = function(app, mongoose) {
  var userSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: String,
    email: { type: String, unique: true },
    sex: { type: Number, default: 0 },
    roles: {
      account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' }
    },
    isActive: String,
    timeCreated: { type: Date, default: Date.now },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    vkontakte: {},
    facebook: {},
    google: {},
    total: {
      views: { type: Number, default: 0 },
      wishlist: { type: Number, default: 0 },
      time: { type: Number, default: 0 }
    },
    search: [String]
  });

  userSchema.methods.defaultReturnUrl = function() {
    var returnUrl = '/account/' + this.username;

    return returnUrl;
  };
  userSchema.statics.encryptPassword = function(password, done) {
    var bcrypt = require('bcryptjs');
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
    var bcrypt = require('bcryptjs');
    bcrypt.compare(password, hash, function(err, res) {
      done(err, res);
    });
  };
  userSchema.plugin(require('./plugins/pagedFind'));
  userSchema.index({ username: 1 }, { unique: true });
  userSchema.index({ email: 1 }, { unique: true });
  userSchema.index({ timeCreated: 1 });
  userSchema.index({ 'vkontakte.id': 1 });
  userSchema.index({ 'facebook.id': 1 });
  userSchema.index({ 'google.id': 1 });
  userSchema.index({ search: 1 });
  app.db.model('User', userSchema);
};
