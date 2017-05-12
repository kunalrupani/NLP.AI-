var mongoose = require('mongoose');


var Oauth2ClientSchema = mongoose.Schema( {

  oauth2_client:  {
      type: String
  }
  
});

Oauth2ClientSchema.methods.toJSON = function () {
  var oauthinfo = this;
  var oauthinfoObject = user.toObject();

  return oauthinfoObject;

};


var Oauth2Client = mongoose.model('Oauth2Client', Oauth2ClientSchema);

module.exports = {Oauth2Client};