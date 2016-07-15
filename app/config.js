'use strict';

exports.port = 80;
exports.rootPath = 'C:\\caaat\\git\\crisppic\\app\\'; //'/home/app/'
exports.hostUrl = 'http://crisppic.com/';
exports.mongodb = {
  uri: 'mongodb://85.143.222.142:28345/movies'
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
    name: exports.projectName,
    address: 'noreply@crisppic.com'
  },
  credentials: {
    user: 'noreply@crisppic.com',
    password: 'GCu&ea/q.QE"y#4FHerg',
    host: 'smtp.yandex.ru',
    ssl: true
  }
};
exports.oauth = {
  facebook: {
    key: '1515012572125322',
    secret: '97487b28cee723f7a04dee219bca2d55'
  },
  google: {
    key: '673575507802-h1p3s5gugi31g4s2mf5mjtsgmn2h12r1.apps.googleusercontent.com',
    secret: 'pXQkWP6WHz9bPuwjQ0kD-BnA'
  },
  vkontakte: {
    key: '5245120',
    secret: 'ApOJ1e9PH9REXHQeQRJM'
  }
};
