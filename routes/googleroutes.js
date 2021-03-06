const express = require('express');
const router = express.Router();
const request = require('request');

var datetime = require('node-datetime');

//Google SDKs
const google = require('googleapis');
const googleAuth = require('google-auth-library');

//MongooseDB for Token store
var {mongoose} = require('../db/mongoose');
var {Oauth2Client} = require('../db/mtokens');

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

  authcode= req.query.code;

  if (authcode == null){
    res.redirect('/google/loginfirst');
  }
  else {
  oauth2Client.getToken(authcode, function (err, tokens) {
    console.log('Received Access Token $$$$$$$$$$$$$$$$$$$$$$$$', tokens);
  // Now tokens contains an access_token and an optional refresh_token. Save them.
  if (!err) {
    oauth2Client.setCredentials({
  access_token: tokens.access_token,
  refresh_token: tokens.refresh_token,
  // Optional, provide an expiry_date (milliseconds since the Unix Epoch)
  expiry_date: (new Date()).getTime() + (1000 * 60 * 60 * 24 * 7 * 52)
});
    
    
    console.log(typeof(oauth2Client));
    console.log('KunalsRupani *********** oauth2Client:', oauth2Client);
}
 var mauth2Client = new Oauth2Client (oauth2Client);

  mauth2Client.save().then(()=>{
    console.log('Successfully saved oauth2_client in DB');
  }, (e) => {
    console.log('Error Saving oauth2_client in DB:' , e);
  })

  res.send('<p>Authenticated by Google ! </p>');
});
  }
});

// Create Events

// router.get('/createevent', function (req, res) {

// console.log("#### I am in Google create event  #####"); 

// var startTime = new Date('2017-05-13 16:00:00 GMT-0700');

// var endTime = new Date('2017-05-13 17:00:00 GMT-0700');

// console.log('^^^^^^^ startDateTime =', startTime);
// console.log('^^^^^^^ endDateTime =', endTime);

// var event = {
//   'summary': 'Meeting Setup with Kunal',
//   'location': 'San Jose',
//   'description': 'askRupaniBot experimentation',
//   'start': {
//     'dateTime': startTime,
//     'timeZone': 'America/Los_Angeles',
//   },
//   'end': {
//     'dateTime': endTime,
//     'timeZone': 'America/Los_Angeles',
//   },
//   'recurrence': [
//     'RRULE:FREQ=DAILY;COUNT=1'
//   ],
//   'attendees': [
//     {'email': 'rupanikunal@hotmail.com'},
//   ],
//   'reminders': {
//     'useDefault': false,
//     'overrides': [
//       {'method': 'email', 'minutes': 24 * 60},
//       {'method': 'popup', 'minutes': 10},
//     ],
//   },
// };

//   var oauth2Client1=new auth.OAuth2(
//   '739725624072-s0pl5n494ek7pmm1bdeh84ubcjl7sc2b.apps.googleusercontent.com',
//   'M9cXrkBGQ-JujTgyG2qOAAAe',
//   'https://pointylabs.herokuapp.com/google/login'
// );

//   Oauth2Client.find({}, (err, oauth2clients)=>{
//     oauth2Client1.setCredentials(oauth2clients[0].credentials);    
//     calendar.events.insert({
//     auth: oauth2Client1,
//     calendarId: 'primary',
//     sendNotifications: true,
//     resource: event,
//     }, function(err, event) {
//     if (err) {
//      console.log('There was an error contacting the Calendar service: ' + err);
//      return;
//     }
//     console.log('Event created: %s', event.htmlLink);
//    });
//   }
// );
// }
// );

// List 3 upcoming events



router.get('/listevents', function (req, res) {
  console.log("#### I am in Google list events #####"); 

   var oauth2Client1=new auth.OAuth2(
  '739725624072-s0pl5n494ek7pmm1bdeh84ubcjl7sc2b.apps.googleusercontent.com',
  'M9cXrkBGQ-JujTgyG2qOAAAe',
  'https://pointylabs.herokuapp.com/google/login'
);
   Oauth2Client.find({}, (err, oauth2clients)=>{
    oauth2Client1.setCredentials(oauth2clients[0].credentials);    
    calendar.events.list({
    auth: oauth2Client1,
    timeMin: (new Date()).toISOString(),
    maxResults: 3,
    singleEvents: true,
    orderBy: 'startTime',
    calendarId: 'primary'
    }, function(err, events) {
    if (err) {
     console.log('There was an error contacting the Calendar service: ' + err);
     return;
    }
    console.log('Events list ###### ', events);
     });
   }
  );
});

module.exports = router;

