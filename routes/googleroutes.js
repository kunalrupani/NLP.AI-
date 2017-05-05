const express = require('express');
const router = express.Router();
var request = require('request');

const google = require('googleapis');




var OAuth2 = google.auth.OAuth2;

var oauth2Client = new OAuth2(
  '739725624072-s0pl5n494ek7pmm1bdeh84ubcjl7sc2b.apps.googleusercontent.com',
  'M9cXrkBGQ-JujTgyG2qOAAAe',
  'https://pointylabs.herokuapp.com/google/login'
);




/* GET home page. */
router.get('/', function (req, res) {
  // check for token
  console.log("#### I am in Google Root #####");

});


/*Authentication page. */
router.get('/loginfirst', function (req, res) {
  console.log("#### I am in Google loginfirst #####"); 
  // generate a url that asks permissions for Google+ and Google Calendar scopes
    var scopes = [
    'https://www.googleapis.com/auth/plus.me',
    'https://www.googleapis.com/auth/calendar'
    ];

    var url = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: 'offline',

    // If you only need one scope you can pass it as a string
    scope: scopes,

     });
 
     console.log('Google URL******', url);

     res.redirect(url);
  //   require('request').debug = true;

  //   var options = {
  //       uri: url,  
  //       method: 'GET',
  //      // headers: headers
  //   };

  //   request(options, function (error, response, body) {
    
  //   console.log("Hello calendar ***********************");
  //   console.log('error:', error); // Print the error if one occurred
  //   console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  // //  console.log('body:', body); // Print the HTML for the Google homepage.
  //   });

 });

/*Authentication page. */
router.get('/login', function (req, res) {
  console.log("#### I am in Google login #####"); 
  console.log('REQ HEADERS',req.headers);
  console.log('REQ BODY',req.body);
  console.log('REQ QUERY********',req.query.code);

  authcode= req.query.code;

  oauth2Client.getToken(authcode, function (err, tokens) {
  // Now tokens contains an access_token and an optional refresh_token. Save them.
  if (!err) {
    oauth2Client.setCredentials(tokens);
  }
});
  console.log('Saved Access Token $$$$$$$$$$$$$$$$$$$$$$$$', oauth2Client.getToken);

});


/*Authentication page. */
router.get('/listcalendars', function (req, res) {
  console.log("#### I am in Google list calendars #####"); 
  
    //require('request').debug = true;
//oauth2Client.getToken.
    var options = {
        uri: "https://www.googleapis.com/calendar/v3/calendars/kunalrupani%40gmail.com/events?key=",  
        method: 'GET',
       // headers: headers
    };

    request(options, function (error, response, body) {
    
    console.log("Hello calendar ***********************");
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  //  console.log('body:', body); // Print the HTML for the Google homepage.
    });


});

module.exports = router;
