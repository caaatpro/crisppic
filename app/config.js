'use strict';

exports.port = process.env.PORT || 80;
exports.mongodb = {
  //uri: 'mongodb://crisppic_db:27017/movies'
  uri: 'mongodb://db:27017/movies'
};
exports.projectName = 'Crisppic.com';
exports.systemEmail = 'noreply@crisppic.com';
exports.cryptoKey = 'ce6d811282249a030224ca736ba4e6b0';
exports.loginAttempts = {
  forIp: 50,
  forIpAndUser: 7,
  logExpiration: '20m'
};
exports.requireAccountVerification = true;
exports.smtp = {
  from: {
    name: process.env.SMTP_FROM_NAME || exports.projectName,
    address: process.env.SMTP_FROM_ADDRESS || 'noreply@crisppic.com'
  },
  credentials: {
    user: process.env.SMTP_USERNAME || 'noreply@crisppic.com',
    password: process.env.SMTP_PASSWORD || 'GCu&ea/q.QE"y#4FHerg',
    host: process.env.SMTP_HOST || 'smtp.yandex.ru',
    ssl: true
  }
};
exports.oauth = {
  facebook: {
    key: process.env.FACEBOOK_OAUTH_KEY || '1515012572125322',
    secret: process.env.FACEBOOK_OAUTH_SECRET || '97487b28cee723f7a04dee219bca2d55'
  },
  google: {
    key: process.env.GOOGLE_OAUTH_KEY || '673575507802-h1p3s5gugi31g4s2mf5mjtsgmn2h12r1.apps.googleusercontent.com',
    secret: process.env.GOOGLE_OAUTH_SECRET || 'pXQkWP6WHz9bPuwjQ0kD-BnA'
  },
  vkontakte: {
    key: process.env.VKONTAKTE_OAUTH_KEY || '5245120',
    secret: process.env.VKONTAKTE_OAUTH_SECRET || 'ApOJ1e9PH9REXHQeQRJM'
  }
};