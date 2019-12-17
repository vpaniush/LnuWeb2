var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

router.get('/google', passport.authenticate('google',
    {
        scope: ['profile'],
        prompt: 'select_account'
    }
));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/google' }),
    (req, res) => {
        res.redirect('/');
    }
);

module.exports = router;