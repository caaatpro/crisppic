'use strict';

<<<<<<< HEAD
exports.port = process.env.PORT || 3030;
exports.mongodb = {
  uri: 'mongodb://94.103.80.182:27000/movies'
};
exports.projectName = 'Crisppic';
=======
exports.port = process.env.PORT || 3000;
exports.mongodb = {
  uri: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://94.103.80.182:27000/drywall'
};
exports.companyName = 'Acme, Inc.';
exports.projectName = 'Drywall';
>>>>>>> d8e7b97b87c84f50f2d7db2acecf4bfb0a344446
exports.systemEmail = 'cyber.paw@ya.ru';
exports.cryptoKey = 'k3yb0ardc4t';
exports.loginAttempts = {
  forIp: 50,
  forIpAndUser: 7,
  logExpiration: '20m'
};
exports.requireAccountVerification = false;
exports.smtp = {
  from: {
    name: process.env.SMTP_FROM_NAME || exports.projectName +' Website',
    address: process.env.SMTP_FROM_ADDRESS || 'cyber.paw@ya.ru'
  },
  credentials: {
    user: process.env.SMTP_USERNAME || 'cyber.paw@ya.ru',
    password: process.env.SMTP_PASSWORD || 'cgb;bdbyfltqcz',
    host: process.env.SMTP_HOST || 'smtp.yandex.ru',
    ssl: true
  }
};
exports.oauth = {
  twitter: {
    key: process.env.TWITTER_OAUTH_KEY || '',
    secret: process.env.TWITTER_OAUTH_SECRET || ''
  },
  facebook: {
<<<<<<< HEAD
    key: process.env.FACEBOOK_OAUTH_KEY || '1515012572125322',
    secret: process.env.FACEBOOK_OAUTH_SECRET || '97487b28cee723f7a04dee219bca2d55'
  },
  google: {
    key: process.env.GOOGLE_OAUTH_KEY || '673575507802-h1p3s5gugi31g4s2mf5mjtsgmn2h12r1.apps.googleusercontent.com',
    secret: process.env.GOOGLE_OAUTH_SECRET || '8UQCXrRRSNH7mCItDea5YXtP'
  }
};
=======
    key: process.env.FACEBOOK_OAUTH_KEY || '',
    secret: process.env.FACEBOOK_OAUTH_SECRET || ''
  },
  github: {
    key: process.env.GITHUB_OAUTH_KEY || '',
    secret: process.env.GITHUB_OAUTH_SECRET || ''
  },
  google: {
    key: process.env.GOOGLE_OAUTH_KEY || '',
    secret: process.env.GOOGLE_OAUTH_SECRET || ''
  },
  tumblr: {
    key: process.env.TUMBLR_OAUTH_KEY || '',
    secret: process.env.TUMBLR_OAUTH_SECRET || ''
  }
};
>>>>>>> d8e7b97b87c84f50f2d7db2acecf4bfb0a344446
