'use strict';

exports.init = function(req, res){
  var workflow = req.app.utility.workflow(req, res);
  var sigma = {};
  var re_imdb = /https?:\/\/(www.)?imdb.com\/title\/(tt\d{7})(.*)/i;

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
    req.app.db.models['Movie'].find(/*{'search': regexQuery}*/).skip((page-1)*per_page).limit(per_page).exec(function(err, result) {
      sigma['items'] = [];
      for (var i = 0; i < result.length; i++) {
        var item = {};
        item.sID = result[i].sID;
        item.genre = result[i].genre;
        item.titles = result[i].titles; // только русское и английское
        item.views = result[i].views;
        item.country = result[i].country;
        item.poster = result[i].poster; // если есть русский, иначи английский или пусто
        item.year = result[i].year;

        sigma['items'].push(item);
      }

      // sigma['items'] = result;
      sigma['page'] = page;
      sigma['pages'] = pages;
      sigma['query'] = query;

      res.send(sigma);
    });
  });

  workflow.emit('moviesPagination');
};
