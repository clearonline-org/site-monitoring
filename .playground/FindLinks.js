/**
* @Author: mars
* @Date:   2017-01-10T21:54:08-05:00
* @Last modified by:   mars
* @Last modified time: 2017-01-11T00:24:14-05:00
*/
var Crawler = require("js-crawler");

var crawler = new Crawler().configure({ignoreRelative: true, depth: 1});

crawler.crawl({
  url: "http://clearonline.org",
  success: function(page) {
    console.log(page.url, page.response);
  },
  failure: function(page) {
    console.log(page.status);
  },
  finished: function(crawledUrls) {
    console.log(crawledUrls);
  }
});
