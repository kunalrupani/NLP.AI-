var mongoose = require('mongoose');
const googleAuth = require('google-auth-library');

var auth = new googleAuth();
var oauth2Client = new auth.OAuth2();

var Oauth2ClientSchema = mongoose.Schema( {

  oauth2_client:  {
      type: oauth2Client
  }
  
});

Oauth2ClientSchema.methods.toJSON = function () {
  var oauthinfo = this;
  var oauthinfoObject = user.toObject();

  return oauthinfoObject;

};


var Oauth2Client = mongoose.model('Oauth2Client', Oauth2ClientSchema);

module.exports = {Oauth2Client};