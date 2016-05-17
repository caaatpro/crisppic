'use strict';

exports = module.exports = function(app, passport) {
  var LocalStrategy = require('passport-local').Strategy,
      FacebookStrategy = require('passport-facebook').Strategy,
      VkontakteStrategy = require('passport-vkontakte').Strategy,
      GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

  passport.use(new LocalStrategy(
    function(username, password, done) {
      var conditions = { isActive: 'yes' };
      if (username.indexOf('@') === -1) {
        conditions.username = username;
      }
      else {
        conditions.email = username.toLowerCase();
      }

      app.db.models.User.findOne(conditions, function(err, user) {
        if (err) {
          return done(err);
        }

        if (!user) {
          return done(null, false, { message: 'Unknown user' });
        }

        app.db.models.User.validatePassword(password, user.password, function(err, isValid) {
          if (err) {
            return done(err);
          }

          if (!isValid) {
            return done(null, false, { message: 'Invalid password' });
          }

          return done(null, user);
        });
      });
    }
  ));

  if (app.config.oauth.facebook.key) {
    passport.use(new FacebookStrategy({
        clientID: app.config.oauth.facebook.key,
        clientSecret: app.config.oauth.facebook.secret,
        profileFields: ['id', 'emails', 'name']
      },
      function(accessToken, refreshToken, profile, done) {
        done(null, false, {
          accessToken: accessToken,
          refreshToken: refreshToken,
          profile: profile
        });
      }
    ));
  }

  if (app.config.oauth.google.key) {
    passport.use(new GoogleStrategy({
        clientID: app.config.oauth.google.key,
        clientSecret: app.config.oauth.google.secret,
        profileFields: ['id', 'emails', 'name']
      },
      function(accessToken, refreshToken, profile, done) {
        done(null, false, {
          accessToken: accessToken,
          refreshToken: refreshToken,
          profile: profile
        });
      }
    ));
  }

  if (app.config.oauth.vkontakte.key) {
    passport.use(new VkontakteStrategy({
          clientID: app.config.oauth.vkontakte.key,
          clientSecret: app.config.oauth.vkontakte.secret,
          profileFields: ['id', 'emails', 'name']
        },
        function(accessToken, refreshToken, params, profile, done) {
          done(null, false, {
            accessToken: accessToken,
            refreshToken: refreshToken,
            profile: profile,
            params: params
          });
        }
    ));
  }

  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    app.db.models.User.findOne({ _id: id }).populate('roles.account').exec(function(err, user) {
      done(err, user);
    });
  });
};
