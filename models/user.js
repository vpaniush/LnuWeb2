var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    username: String,
    googleId: String,
    cart: Object
});

module.exports = mongoose.model('User', schema);