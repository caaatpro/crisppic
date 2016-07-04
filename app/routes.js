'use strict';

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.set('X-Auth-Required', 'true');
  req.session.returnUrl = req.originalUrl;
  res.redirect('/login/');
}

function ensureAccount(req, res, next) {
  if (req.app.config.requireAccountVerification) {
    if (req.user.roles.account.isVerified !== 'yes' && !/^\/account\/verification\//.test(req.url)) {
      return res.redirect('/account/verification/');
    }
  }
  return next();
}

exports = module.exports = function(app, passport) {
  //front end
  app.get('/', require('./views/index').init);
  app.get('/about/', require('./views/about/index').init);
  app.get('/about/faq/', require('./views/about/faq/index').init);
  app.get('/about/contact/', require('./views/about/contact/index').init);
  app.get('/pro/', require('./views/pro/index').init);

  // movies
  app.all('/movie*', ensureAuthenticated);
  app.get('/movie/*', require('./views/movie/index').init);
  app.post('/movie/*', require('./views/movie/index').AddView);
  app.get('/api/movies/', require('./views/movies/index').init);

  app.get('/contact/', require('./views/contact/index').init);
  app.post('/contact/', require('./views/contact/index').sendMessage);

  //sign up
  app.get('/signup/', require('./views/signup/index').init);
  app.post('/signup/', require('./views/signup/index').signup);
  app.post('/signup/social/', require('./views/signup/index').signupSocial);

  //login/out
  app.get('/login/', require('./views/login/index').init);
  app.post('/login/', require('./views/login/index').login);
  app.get('/login/forgot/', require('./views/login/forgot/index').init);
  app.post('/login/forgot/', require('./views/login/forgot/index').send);
  app.get('/login/reset/', require('./views/login/reset/index').init);
  app.get('/login/reset/:email/:token/', require('./views/login/reset/index').init);
  app.put('/login/reset/:email/:token/', require('./views/login/reset/index').set);
  app.get('/logout/', require('./views/logout/index').init);

  //social login
  //auth
  app.get('/login/facebook/', passport.authenticate('facebook', { callbackURL: '/login/facebook/callback/', scope: ['public_profile email'], authType: 'rerequest' }));
  app.get('/login/facebook/callback/', require('./views/login/index').loginFacebook);
  app.get('/login/google/', passport.authenticate('google', { callbackURL: '/login/google/callback/', scope: ['profile email'] }));
  app.get('/login/google/callback/', require('./views/login/index').loginGoogle);
  app.get('/login/vkontakte/', passport.authenticate('vkontakte', { callbackURL: '/login/vkontakte/callback/', scope: ['email']}));
  app.get('/login/vkontakte/callback/', require('./views/login/index').loginVkontakte);

  //account
  app.all('/account*', ensureAuthenticated);
  app.all('/account*', ensureAccount);

  //account > verification
  app.get('/account/verification/', require('./views/account/verification/index').init);
  app.post('/account/verification/', require('./views/account/verification/index').resendVerification);
  app.get('/account/verification/:token/', require('./views/account/verification/index').verify);

  //account > settings
  app.get('/account/settings/', require('./views/account/settings/index').init);
  app.put('/account/settings/save/', require('./views/account/settings/index').save);
  app.put('/account/settings/password/', require('./views/account/settings/index').password);

  //account > settings > social
  app.get('/account/settings/facebook/', passport.authenticate('facebook', { callbackURL: '/account/settings/facebook/callback/' }));
  app.get('/account/settings/facebook/callback/', require('./views/account/settings/index').connectFacebook);
  app.get('/account/settings/facebook/disconnect/', require('./views/account/settings/index').disconnectFacebook);
  app.get('/account/settings/google/', passport.authenticate('google', { callbackURL: '/account/settings/google/callback/', scope: ['profile email'] }));
  app.get('/account/settings/google/callback/', require('./views/account/settings/index').connectGoogle);
  app.get('/account/settings/google/disconnect/', require('./views/account/settings/index').disconnectGoogle);

  app.get('/account/[a-zA-Z0-9\-\_]+/wishlist/', require('./views/account/wishlist/index').init);
  app.get('/account/[a-zA-Z0-9\-\_]+/directors/', require('./views/account/directors/index').init);
  app.get('/account/[a-zA-Z0-9\-\_]+/directors/charts', require('./views/account/directors/index').charts);
  app.get('/account/[a-zA-Z0-9\-\_]+/actors/', require('./views/account/actors/index').init);
  app.get('/account/[a-zA-Z0-9\-\_]+/actors/charts', require('./views/account/actors/index').charts);
  app.get('/account/[a-zA-Z0-9\-\_]+', require('./views/account/index').init);

  //addMovie
  app.get('/addMovie/', require('./views/addMovie/index').init);

  //admin
  app.get('/adminMovie/', require('./views/adminMovie/index').init);

  //route not found
  app.all('*', require('./views/http/index').http404);
};
