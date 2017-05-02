// General imports
const express = require('express');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

// AskRupaniBot imports
const apiai = require('apiai');
const config = require('./config');
const uuid = require('uuid');
const {receivedMessage} = require('./helperfunctions/askrupanibot');

//o365 imports
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var o365routes = require('./routes/o365routes');



// Express Middleware

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
	extended: false
}))

// Process application/json
app.use(bodyParser.json())

//Middleware for cookie management
app.use(cookieParser());

// session middleware configuration
// see https://github.com/expressjs/session
app.use(session({
  secret: '12345QWERTY-SECRET',
  name: 'nodecookie',
  resave: false,
  saveUninitialized: false
}));


// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');




// ------------ Express Paths--------------------//
app.get('/', function(request, response) {
  response.render('pages/index');
});



// -------------- Start FB AskRupaniBot -------------//

//Middleware to verify request came from facebook
app.use(bodyParser.json({
	verify: verifyRequestSignature
}));

function verifyRequestSignature(req, res, buf) {
	var signature = req.headers["x-hub-signature"];

	if (!signature) {
		throw new Error('Couldn\'t validate the signature.');
	} else {
		var elements = signature.split('=');
		var method = elements[0];
		var signatureHash = elements[1];

		var expectedHash = crypto.createHmac('sha1', config.FB_APP_SECRET)
			.update(buf)
			.digest('hex');

		if (signatureHash != expectedHash) {
			throw new Error("Couldn't validate the request signature.");
		}
	}
}

// For Facebook verification
app.get('/askRupaniBot/webhook/', function (req, res) {
	console.log("request");
	if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === config.FB_VERIFY_TOKEN) {
		res.status(200).send(req.query['hub.challenge']);
	} else {
		console.error("Failed validation. Make sure the validation tokens match.");
		res.sendStatus(403);
	}
})

// Facebook Callbacks - all of them are POST requests
app.post('/askRupaniBot/webhook/', function (req, res) {
	var data = req.body;
	console.log("************New Request**************");
	console.log(JSON.stringify(data));

	// Make sure this is a page subscription
	if (data.object == 'page') {
		// Iterate over each entry
		// There may be multiple if batched
		data.entry.forEach(function (pageEntry) {
			var pageID = pageEntry.id;
			var timeOfEvent = pageEntry.time;

			// Iterate over each messaging event
			pageEntry.messaging.forEach(function (messagingEvent) {
			  if (messagingEvent.message) {
					receivedMessage(messagingEvent);
				} else if (messagingEvent.postback) {
					receivedPostback(messagingEvent);
				} else {
					console.log("Webhook received unknown messagingEvent: ", messagingEvent);
				}
			});
		});

		// Assume all went well.
		// You must send back a 200, within 20 seconds
		res.sendStatus(200);
	}
});

// -------------- End FB AskRupaniBot -------------//


//--------------- Start O365 Section ---------------//


//Express Router for o365 routes
app.use('/o365', o365routes);


//--------------- END O365 Section ---------------//


// Express listen

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


