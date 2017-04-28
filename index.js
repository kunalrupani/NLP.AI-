// General imports
const express = require('express');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

// Express Middleware

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
	extended: false
}))

// Process application/json
app.use(bodyParser.json())

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


// ------------ Express Paths--------------------//
app.get('/', function(request, response) {
  response.render('pages/index');
});




// Express listen

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


