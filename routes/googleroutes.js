const express = require('express');
const router = express.Router();
const request = require('request');

//Google SDKs
const google = require('googleapis');
const googleAuth = require('google-auth-library');


var accessToken;
var calendar = google.calendar('v3');
var auth = new googleAuth();

var oauth2Client = new auth.OAuth2(
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
    approval_prompt: 'force',
    // If you only need one scope you can pass it as a string
    scope: scopes,

     });
 
     console.log('Google URL******', url);

     res.redirect(url);

 });

/*Authentication page. */
router.get('/login', function (req, res) {
  console.log("#### I am in Google login #####"); 
  console.log('REQ HEADERS',req.headers);
  console.log('REQ BODY',req.body);
  console.log('REQ QUERY********',req.query.code);

  authcode= req.query.code;

  if (authcode == null){
    res.redirect('/google/loginfirst');
  }
  else {
  oauth2Client.getToken(authcode, function (err, tokens) {
    console.log('Received Access Token $$$$$$$$$$$$$$$$$$$$$$$$', tokens);
  // Now tokens contains an access_token and an optional refresh_token. Save them.
  if (!err) {
    oauth2Client.setCredentials(tokens);
  }
  // accessToken = tokens.access_token;
  // refreshToken = tokens.refresh_token;
  // console.log('ACCESS TOKEN', accessToken);
  // console.log('REFRESH TOKEN', refreshToken);
  res.send('<p>Authenticated by Google ! </p>');
});
  }
});




/*List calendars manual api request. */
// router.get('/listcalendars', function (req, res) {
//   console.log("#### I am in Google list calendars #####"); 
  
//   var headers = {
//     // Accept: 'application/json',
//      Authorization: 'Bearer ' + accessToken
//   };

  
//     var options = {
//         uri: "https://www.googleapis.com/calendar/v3/calendars/kunalrupani@gmail.com/events?key=739725624072-s0pl5n494ek7pmm1bdeh84ubcjl7sc2b.apps.googleusercontent.com",  
//         method: 'GET',
//         headers: headers
//     };

//     request(options, function (error, response, body) {
    
//     console.log("Hello calendar ***********************");
//     console.log('error:', error); // Print the error if one occurred
//     console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//     console.log('body:', body); // Print the HTML for the Google homepage.
//     });


// });


router.get('/createevent', function (req, res) {

var event = {
  'summary': 'askRupaniBOT Test',
  'location': 'Lakebrook Court',
  'description': 'askRupaniBot experimentation',
  'start': {
    'dateTime': '2017-05-10T017:00:00-11:00',
    'timeZone': 'America/Los_Angeles',
  },
  'end': {
    'dateTime': '2017-05-10T18:00:00-12:00',
    'timeZone': 'America/Los_Angeles',
  },
  'recurrence': [
    'RRULE:FREQ=DAILY;COUNT=1'
  ],
  'attendees': [
    {'email': 'kunal.rupani@oracle.com'},
    {'email': 'rupanikunal@hotmail.com'},
  ],
  'reminders': {
    'useDefault': false,
    'overrides': [
      {'method': 'email', 'minutes': 24 * 60},
      {'method': 'popup', 'minutes': 10},
    ],
  },
};

calendar.events.insert({
  auth: oauth2Client,
  calendarId: 'primary',
  resource: event,
}, function(err, event) {
  if (err) {
    console.log('There was an error contacting the Calendar service: ' + err);
    return;
  }
  console.log('Event created: %s', event.htmlLink);
});

});

router.get('/listevents', function (req, res) {
  console.log("#### I am in Google list events #####"); 
  calendar.events.list({
    auth: oauth2Client,
    calendarId: 'primary'
}, function(err, events) {
  if (err) {
    console.log('There was an error contacting the Calendar service: ' + err);
    return;
  }
  console.log('Events list ', events);
});

});



module.exports = router;

