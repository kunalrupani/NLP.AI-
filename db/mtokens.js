var mongoose = require('mongoose');

var Oauth2ClientSchema = mongoose.Schema( {

  oauth2_client:  {
      type: Object
  }
  
});

var Oauth2Client = mongoose.model('Oauth2Client', Oauth2ClientSchema);

module.exports = {Oauth2Client};