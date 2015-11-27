'use strict';

exports = module.exports = function(app, mongoose) {

  //then regular docs
  require('./schema/User')(app, mongoose);
  require('./schema/Admin')(app, mongoose);
  require('./schema/AdminGroup')(app, mongoose);
  require('./schema/Account')(app, mongoose);
  require('./schema/LoginAttempt')(app, mongoose);
<<<<<<< HEAD
  require('./schema/Movie')(app, mongoose);
  require('./schema/UsersMovie')(app, mongoose);
  require('./schema/Country')(app, mongoose);
  require('./schema/Directed')(app, mongoose);
  require('./schema/Genre')(app, mongoose);
=======
>>>>>>> d8e7b97b87c84f50f2d7db2acecf4bfb0a344446
};
