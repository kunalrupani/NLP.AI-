var mongoose = require('mongoose');


var Oauth2ClientSchema = mongoose.Schema( {

  oauth2_client:  {
      
  OAuth2Client: {
      transporter: {
        USER_AGENT: String
      },
      clientID_ : String,
      clientSecret_ : String,
      redirectUri_ : String,
      opts: {},
      credentials: {
        access_token: String,
        id_token: String,
        refresh_token: String,
        expiry_date: Date
      }

    }

  }
  
});

// Oauth2ClientSchema.methods.toJSON = function () {
//   var oauthinfo = this;
//   var oauthinfoObject = oauthinfo.toObject();
//   return oauthinfoObject;

// };


var Oauth2Client = mongoose.model('Oauth2Client', Oauth2ClientSchema);

module.exports = {Oauth2Client};