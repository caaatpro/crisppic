'use strict';

exports = module.exports = function(app, mongoose) {

  //then regular docs
  require('./schema/User')(app, mongoose);
  require('./schema/Admin')(app, mongoose);
  require('./schema/AdminGroup')(app, mongoose);
  require('./schema/Account')(app, mongoose);
  require('./schema/LoginAttempt')(app, mongoose);
  require('./schema/Movie')(app, mongoose);
  require('./schema/UsersMovie')(app, mongoose);
  require('./schema/Country')(app, mongoose);
  require('./schema/Directed')(app, mongoose);
  require('./schema/Genre')(app, mongoose);
};
