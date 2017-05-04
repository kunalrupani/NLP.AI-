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
var fbMessroutes = require('./routes/fbmessroutes');


// Express Middleware

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
	extended: false
}))

// Process application/json
app.use(bodyParser.json())

// //Middleware to verify request came from facebook
// app.use(bodyParser.json({
// 	verify: verifyRequestSignature
// }));


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
app.set('view engine', 'ejs');




// ------------ Express Paths--------------------//
app.get('/', function(request, response) {
  response.render('pages/index');
});



// -------------- Start FB AskRupaniBot -------------//



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

//Express Router for fbmessenger routes
//app.use('/askRupaniBot', fbMessroutes);
app.use('/askRupaniBot', o365routes);


// -------------- End FB AskRupaniBot -------------//


//--------------- Start O365 Section ---------------//


//Express Router for o365 routes
app.use('/o365', o365routes);


//--------------- END O365 Section ---------------//


// Express listen

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


