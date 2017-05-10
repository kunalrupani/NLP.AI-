var mongoose = require('mongoose');

var Oauth2Client = mongoose.model('Tokens', {

  oauth2_client:  {
      type: Object
  }
  
});
module.exports = {OAuth2Client};