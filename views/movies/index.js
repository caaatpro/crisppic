'use strict';

exports.init = function(req, res){
  var workflow = req.app.utility.workflow(req, res);
  var sigma = {};
  var re_imdb = /https?:\/\/(www.)?imdb.com\/title\/(tt\d{7})(.*)/i;

  //return req.app.utility.parser(req, res);

  var page = parseInt(req.query.page) || 1;
  var query = req.query.query || '';

  if (re_imdb.test(query)) {
    var imdb_id = query.replace(re_imdb, "$2");
    return req.app.utility.imdbparser(req, res, imdb_id);
  }

  var regexQuery = new RegExp('^.*?'+ query +'.*$', 'i');
  var per_page = 20;
  var pages = [];

  workflow.on('moviesPagination', function() {
    req.app.db.models['Movie'].count({'search': regexQuery}, function(err, total) {

      var total_pages = total/per_page;

      var range = 10;
      var start = Math.floor(page/range)*range+1;

      if (page >= range) pages.push("p");

      for (var i=start; i<=start+range && i<=total_pages; i++)  {
        pages.push(i)
      }

      if (page < total_pages) pages.push("n");

      workflow.emit('moviesInit');
    });
  });

  workflow.on('moviesInit', function() {
    req.app.db.models['Movie'].find({'search': regexQuery}).skip((page-1)*per_page).limit(per_page).exec(function(err, result) {

      sigma['items'] = result;
      sigma['page'] = page;
      sigma['pages'] = pages;
      sigma['query'] = query;

      res.render('movies/index', sigma);
    });
  });

  workflow.emit('moviesPagination');
};
