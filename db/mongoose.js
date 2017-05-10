var mongoose = require('mongoose');

//instructs to use promises
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://askrupanibot-mongouser:askrupani@ds137261.mlab.com:37261/heroku_1715b2r4');

module.exports ={
    mongoose
};