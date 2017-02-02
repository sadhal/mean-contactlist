var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var request = require('request');

var CONTACTS_COLLECTION = "contacts";

var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

// Initialize the app.
var server = app.listen(process.env.PORT || 8888, function () {
  var port = server.address().port;
  console.log("App now running on port", port);
});

// CONTACTS API ROUTES BELOW

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

/*  "/contacts"
 *    GET: finds all contacts
 *    POST: creates a new contact
 */


var dbContacts = [{ name: "sadmir", username: "sadhal", createdOn: new Date() }];
var myURL = 'http://gradle-spingboot-seed-contacts-be-dev.10.101.2.180.xip.io/personer';

app.get("/contacts", function(req, res) {

  try {
    request
      .get(myURL, function(error, response, body) {
        if (error) console.error(error);
        else if (response.statusCode == 200) {
          console.log(body);
        } else { 
          console.error("bad response");
          console.error(response.statusCode);
        }
      });

  } catch (t) {
    console.error(t);
  }

  res.status(200).json(dbContacts.map(function(c, index){
    return {
			_id : index,
			firstName : c.name,
			lastName  : c.name,
			createdOn	: c.createdOn
    };
  }));
});

app.post("/contacts", function(req, res) {
  var newContact = req.body;
  newContact.createdOn = new Date();

  if (!(req.body.firstName || req.body.lastName)) {
    handleError(res, "Invalid user input", "Must provide a first or last name.", 400);
  }

  newContact.name = req.body.firstName + ' ' + req.body.lastName;
  newContact.username = req.body.firstName;

  var opts = {
    method: 'POST',
    uri: myURL,
    json: true,
    body: newContact
  };
  request(opts, function(e,r,body) {
    if (e) console.error(e);
    else console.log(body);
  });

  dbContacts.push(newContact);

  res.status(201).json(newContact);
});

/*  "/contacts/:id"
 *    GET: find contact by id
 *    PUT: update contact by id
 *    DELETE: deletes contact by id
 */

app.get("/contacts/:id", function(req, res) {
  handleError(res, "get /contacts/:id is not implemented yet!", 500);
});

app.put("/contacts/:id", function(req, res) {
  handleError(res, "put /contacts/:id is not implemented yet!", 500);});

app.delete("/contacts/:id", function(req, res) {
  handleError(res, "delete /contacts/:id is not implemented yet!", 500);
});
