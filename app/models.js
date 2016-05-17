'use strict';

exports = module.exports = function(app, mongoose) {

  //then regular docs
  require('./schema/Index')(app, mongoose);
  require('./schema/User')(app, mongoose);
  require('./schema/Account')(app, mongoose);
  require('./schema/LoginAttempt')(app, mongoose);
  require('./schema/Movie')(app, mongoose);
  require('./schema/Country')(app, mongoose);
  require('./schema/Director')(app, mongoose);
  require('./schema/Genre')(app, mongoose);
  require('./schema/Actor')(app, mongoose);
  require('./schema/UserMovie')(app, mongoose);
  require('./schema/UserMovieActor')(app, mongoose);
  require('./schema/UserMovieDirector')(app, mongoose);
  require('./schema/UserMovieNote')(app, mongoose);
};
