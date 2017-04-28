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


// // -------------- Start FB AskRupaniBot -------------//

// //Middleware to verify request came from facebook
// app.use(bodyParser.json({
// 	verify: verifyRequestSignature
// }));

// function verifyRequestSignature(req, res, buf) {
// 	var signature = req.headers["x-hub-signature"];

// 	if (!signature) {
// 		throw new Error('Couldn\'t validate the signature.');
// 	} else {
// 		var elements = signature.split('=');
// 		var method = elements[0];
// 		var signatureHash = elements[1];

// 		var expectedHash = crypto.createHmac('sha1', config.FB_APP_SECRET)
// 			.update(buf)
// 			.digest('hex');

// 		if (signatureHash != expectedHash) {
// 			throw new Error("Couldn't validate the request signature.");
// 		}
// 	}
// }


// // API AI Setup
// const apiAiService = apiai(config.API_AI_CLIENT_ACCESS_TOKEN, {
// 	language: "en",
// 	requestSource: "fb"
// });

// const sessionIds = new Map();

// // For Facebook verification
// app.get('/askRupaniBot/webhook/', function (req, res) {
// 	console.log("request");
// 	if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === config.FB_VERIFY_TOKEN) {
// 		res.status(200).send(req.query['hub.challenge']);
// 	} else {
// 		console.error("Failed validation. Make sure the validation tokens match.");
// 		res.sendStatus(403);
// 	}
// })

// // Facebook Callbacks - all of them are POST requests
// app.post('/askRupaniBot/webhook/', function (req, res) {
// 	var data = req.body;
// 	console.log(JSON.stringify(data));

// 	// Make sure this is a page subscription
// 	if (data.object == 'page') {
// 		// Iterate over each entry
// 		// There may be multiple if batched
// 		data.entry.forEach(function (pageEntry) {
// 			var pageID = pageEntry.id;
// 			var timeOfEvent = pageEntry.time;

// 			// Iterate over each messaging event
// 			pageEntry.messaging.forEach(function (messagingEvent) {
// 			  if (messagingEvent.message) {
// 					receivedMessage(messagingEvent);
// 				} else if (messagingEvent.postback) {
// 					receivedPostback(messagingEvent);
// 				} else {
// 					console.log("Webhook received unknown messagingEvent: ", messagingEvent);
// 				}
// 			});
// 		});

// 		// Assume all went well.
// 		// You must send back a 200, within 20 seconds
// 		res.sendStatus(200);
// 	}
// });

// //Functions
// function receivedMessage(event) {

// 	var senderID = event.sender.id;
// 	var recipientID = event.recipient.id;
// 	var timeOfMessage = event.timestamp;
// 	var message = event.message;

// 	if (!sessionIds.has(senderID)) {
// 		sessionIds.set(senderID, uuid.v1());
// 	}
// 	console.log("Received message for user %d and page %d at %d with message:", senderID, recipientID, timeOfMessage);
// 	console.log(JSON.stringify(message));

// 	var isEcho = message.is_echo;
// 	var messageId = message.mid;
// 	var appId = message.app_id;
// 	var metadata = message.metadata;

// 	// You may get a text or attachment but not both
// 	var messageText = message.text;

// 	if (isEcho) {
// 		handleEcho(messageId, appId, metadata);
// 		return;
// 	} 
// 	if (messageText) {
// 		//send message to api.ai
// 		sendToApiAi(senderID, messageText);
// 	} 
// }

// // Send received message to API.AI

// function sendToApiAi(sender, text) {

// 	sendTypingOn(sender);
// 	let apiaiRequest = apiAiService.textRequest(text, {
// 		sessionId: sessionIds.get(sender)
// 	});

// 	apiaiRequest.on('response', (response) => {
// 		if (isDefined(response.result)) {
// 			handleApiAiResponse(sender, response);
// 		}
// 	});

// 	apiaiRequest.on('error', (error) => console.error(error));
// 	apiaiRequest.end();
// }

// function handleApiAiResponse(sender, response) {
// 	let responseText = response.result.fulfillment.speech;

// 	sendTypingOff(sender);

// 	if (responseText == '' ) {
// 		//api ai could not evaluate input.
// 		console.log('Unknown query' + response.result.resolvedQuery);
// 		sendTextMessage(sender, "Dude, I have no clue what you are saying. Try again...");
// 	}  else {
// 		sendTextMessage(sender, responseText);
// 	}
// }


// function sendTextMessage(recipientId, text) {
// 	var messageData = {
// 		recipient: {
// 			id: recipientId
// 		},
// 		message: {
// 			text: text
// 		}
// 	}
// 	callSendAPI(messageData);
// }



// //https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-echo
// //This callback will occur when a message has been sent by your page

// function handleEcho(messageId, appId, metadata) {
// 	// Just logging message echoes to console
// 	console.log("Received echo for message %s and app %d with metadata %s", messageId, appId, metadata);
// }

// function receivedPostback(event) {
// 	var senderID = event.sender.id;
// 	var recipientID = event.recipient.id;
// 	var timeOfPostback = event.timestamp;

// 	// The 'payload' param is a developer-defined field which is set in a postback 
// 	// button for Structured Messages. 
// 	var payload = event.postback.payload;

// 	switch (payload) {
// 		default:
// 			//unindentified payload
// 			sendTextMessage(senderID, "I'm not sure what you want. Can you be more specific?");
// 			break;

// 	}

// 	console.log("Received postback for user %d and page %d with payload '%s' " +
// 		"at %d", senderID, recipientID, payload, timeOfPostback);

// }

// /*
//  * Call the Send API. The message data goes in the body. If successful, we'll 
//  * get the message id in a response 
//  *
//  */
// function callSendAPI(messageData) {
// 	request({
// 		uri: 'https://graph.facebook.com/v2.6/me/messages',
// 		qs: {
// 			access_token: config.FB_PAGE_TOKEN
// 		},
// 		method: 'POST',
// 		json: messageData

// 	}, function (error, response, body) {
// 		if (!error && response.statusCode == 200) {
// 			var recipientId = body.recipient_id;
// 			var messageId = body.message_id;

// 			if (messageId) {
// 				console.log("Successfully sent message with id %s to recipient %s",
// 					messageId, recipientId);
// 			} else {
// 				console.log("Successfully called Send API for recipient %s",
// 					recipientId);
// 			}
// 		} else {
// 			console.error("Failed calling Send API", response.statusCode, response.statusMessage, body.error);
// 		}
// 	});
// }


// //Send indicator to FB Messager about the users typing action
// function sendTypingOn(recipientId) {
// 	var messageData = {
// 		recipient: {
// 			id: recipientId
// 		},
// 		sender_action: "typing_on"
// 	};

// 	callSendAPI(messageData);
// }
// function sendTypingOff(recipientId) {
// 	var messageData = {
// 		recipient: {
// 			id: recipientId
// 		},
// 		sender_action: "typing_off"
// 	};

// 	callSendAPI(messageData);
// }

// function isDefined(obj) {
// 	if (typeof obj == 'undefined') {
// 		return false;
// 	}

// 	if (!obj) {
// 		return false;
// 	}

// 	return obj != null;
// }
// // -------------- END FB AskRupaniBot -------------//


// Express listen

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


