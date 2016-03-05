/**
 * Created by Xurxo on 05/03/2016.
 */
var mongoose = require('mongoose');

var conversion = mongoose.Schema({
    date: Date,
    roman: String,
    arabic: Number,
    conversion: String
});

