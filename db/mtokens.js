var mongoose = require('mongoose');

var Oauth2Client = mongoose.model('Oauth2Client', {

  oauth2_client:  {
      type: Object
  }
  
});
module.exports = {Oauth2Client};