var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var request = require("request");
var debug = require("debug")("contacts-fe");
var winston = require("winston");
var log4js = require("log4js");
var logger = log4js.getLogger();

debug("debug: booting app %s", "contacts-fe", { "label": "mymeta" });

winston.level = process.env.LOG_LEVEL || "info";
winston.info("winston: Booting ", { "app": "contacts-fe" });
logger.info("log4js: Booting ", { "app": "contacts-fe" });

var CONTACTS_COLLECTION = "contacts";

var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

// Initialize the app.
var server = app.listen(process.env.PORT || 8888, function () {
  var port = server.address().port;
  console.log("App now running on port", port);
  winston.info("Winston: App now running on port", { "port": port });
  logger.info("log4js: App now running on port", { "port": port });
});

// CONTACTS API ROUTES BELOW

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  winston.error("Winston: ERROR:", { "reason": reason, "message": message });
  logger.error("log4js: ERROR:", { "reason": reason, "message": message });
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
winston.info("Winston: Rest url to back end", { "url": myURL });
logger.info("log4js: Rest url to back end", { "url": myURL });

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
  var opts = {
    method: 'GET',
    uri: myURL,
    headers: {
      'Accept': 'application/json'
    }
  };
  request(opts, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log('Body: ', body);
        winston.verbose("Winston: Body: ", { "body": body });
	logger.debug("log4js: Boddy: ", body);
        body = body ? JSON.parse(body) : [];
        callback(null, body.map(function(c, index) {
          return {
            _id : c.id,
            firstName : c.firstName,
            lastName  : c.lastName,
            email     : c.email,
            twitter   : c.twitterHandle,
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
    handleError(res, "Invalid user input", "Must provide first and last name.", 400);
  }

  newContact.firstName = req.body.firstName;
  newContact.lastName  = req.body.lastName;
  newContact.email = req.body.email;
  newContact.twitterHandle = req.body.twitter;

  var opts = {
    method: 'POST',
    uri: myURL,
    json: true,
    body: newContact,
    headers: {
      'Accept': 'application/json'
    }
  };

  request(opts, function(e,r,body) {
    if (e) {
      handleError(res, "Save failed! User service response: " + e, 500);
    } else {
      console.log('Typeof: ', typeof body, body);
      winston.verbose("Winston: body", { "body": body });
      if (typeof body === 'String') {
        console.log('parsing body');
        body = body ? JSON.parse(body) : newContact;
      }
      if (body && body.id) {
        console.log('adding _id property to model');
        body._id = body.id;
      }
      res.status(201).json(body);
    }
  });
});

/*  "/contacts/:id"
 *    GET: find contact by id
 *    PUT: update contact by id
 *    DELETE: deletes contact by id
 */

app.get("/contacts/:id", function(req, res) {
  fetch(function(error, body) {
    var myContact;
    if (error) {
      console.error(error);
      handleError(res, "Error while searching contact with id: "+ req.params.id, 500);
    } else if (body) {
      console.log(body)
      myContact = body.find(function(item) {
        return item._id === req.params.id;
      });
      if (myContact) {
        res.status(200).json(myContact);
      } else {
        handleError(res, "Could not find contact with id: "+ req.params.id, 404);
      }
    }
  });
});

app.put("/contacts/:id", function(req, res) {
  handleError(res, "put /contacts/:id is not implemented yet!", 500);});

app.delete("/contacts/:id", function(req, res) {
  handleError(res, "delete /contacts/:id is not implemented yet!", 500);
});
