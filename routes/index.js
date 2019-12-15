var express = require('express');
var router = express.Router();
var Wine = require('../models/wine');

/* GET home page. */
router.get('/', function (req, res, next) {
  Wine.find(function (err, docs) {
    var wineRows = [];
    var cols = 3;
    for (var i = 0; i < docs.length; i += cols) {
      wineRows.push(docs.slice(i, i + cols));
    }
    res.render('index', { title: 'WineMarket', wines: wineRows });
  });
});

module.exports = router;
