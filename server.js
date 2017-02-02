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

//var dbContacts = [{ name: "sadmir", username: "sadhal", createdOn: new Date() }];
var myURL = 'http://gradle-spingboot-seed-contacts-be-dev.10.101.2.180.xip.io/personer';
var host = process.env.GRADLE_SPINGBOOT_SEED_SERVICE_HOST;
var port = process.env.GRADLE_SPINGBOOT_SEED_SERVICE_PORT;
if (host && port) {
  myURL = 'http://' + host + ':' + port + '/personer';
}
console.log('Rest url: ' + myURL);

/*  "/contacts"
 *    GET: finds all contacts
 *    POST: creates a new contact
 */

app.get("/contacts", function(req, res) {

  fetch(function(error, body) {
    if (body) {
      res.status(200).json(body);
    } else {
      res.status(500);
    }
  });
});

function fetch(callback) {
  request
    .get(myURL, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body);
        callback(null, body.map(function(c, index) {
          return {
            _id : c.id,
            firstName : c.name,
            lastName  : c.name,
            createdOn : c.createdOn
          };
        }));
      }
    });
}

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

  res.status(201).json(newContact);
});

/*  "/contacts/:id"
 *    GET: find contact by id
 *    PUT: update contact by id
 *    DELETE: deletes contact by id
 */

app.get("/contacts/:id", function(req, res) {
  fetch(function(error, body) {
    if (body) {
      var myContact = body.find(function(item) {
        return item.id === id;
      });
      res.status(200).json(myContact);
    } else {
      handleError(res, "Could not find contact with id: "+ id, 404);
    }
  });
});

app.put("/contacts/:id", function(req, res) {
  handleError(res, "put /contacts/:id is not implemented yet!", 500);});

app.delete("/contacts/:id", function(req, res) {
  handleError(res, "delete /contacts/:id is not implemented yet!", 500);
});
