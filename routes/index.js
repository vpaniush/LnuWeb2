var express = require('express');
var router = express.Router();
var Wine = require('../models/wine');
var User = require('../models/user');

/* GET home page. */
router.get('/', (req, res, next) => {
  Wine.find((err, docs) => {
    res.render('index', { title: 'WineStore', wines: docs, user: req.user });
  });
});

router.get('/add-to-cart/:title', (req, res, next) => {
  var wineTitle = req.params.title;

  Wine.findOne({ title: wineTitle }).then((currentWine) => {
    User.findById(req.user._id, (err, user) => {
      var cart = user.cart ? JSON.parse(JSON.stringify(user.cart)) : {};

      if (cart[wineTitle]) {
        cart[wineTitle]['count']++;
        cart[wineTitle]['totalPrice'] += currentWine['price'];
      } else {
        cart[wineTitle] = { 'count': 1, 'totalPrice': currentWine['price'] };
      }

      user.cart = cart;
      user.save();
    });
    res.redirect('/');
  });
});

router.get('/:username/cart', (req, res, next) => {
  User.findById(req.user._id, (err, user) => {
    res.render('cart', { user: user, wines: user.cart });
  });
});

router.get('/reduce/:title', (req, res, next) => {
  var wineTitle = req.params.title;
  User.findById(req.user._id, (err, user) => {
    var cart = JSON.parse(JSON.stringify(user.cart));
    var itemPrice = cart[wineTitle]['totalPrice'] / cart[wineTitle]['count'];
    cart[wineTitle]['count']--;
    cart[wineTitle]['totalPrice'] -= itemPrice;
    if (cart[wineTitle]['count'] == 0) {
      delete cart[wineTitle];
    }
    user.cart = cart;
    user.save();
    res.redirect('/' + user.username + '/cart');
  });
});

router.get('/remove-all/:title', (req, res, next) => {
  var wineTitle = req.params.title;
  User.findById(req.user._id, (err, user) => {
    var cart = JSON.parse(JSON.stringify(user.cart));
    delete cart[wineTitle];
    user.cart = cart;
    user.save();
    res.redirect('/' + user.username + '/cart');
  });
});

router.get('/checkout', (req, res, next) => {
  res.render('checkout', { user: req.user });
});

router.post('/checkout', (req, res, next) => {
  res.redirect('/');
});

module.exports = router;
