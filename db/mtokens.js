var mongoose = require('mongoose');

var Tokens = mongoose.model('Tokens', {
  access_token: {
    type: String,
    required: true,
    minlength: 1
  },
id_token: {
    type: String
  },
refresh_token: {
    type: String
  },
token_type: {
    type: String
  },
expiry_date: {
    type: String
  }

});
module.exports = {Tokens};