require("coffee-script/register");
require("express-namespace");
var express = require("express");

bodyParser = require("body-parser");
fs = require("fs");
//docs = require("express-mongoose-docs")
cookieParser = require("cookie-parser");
methodOverride = require("method-override");
errorHandler = require("errorhandler");
helmet = require("helmet");
csrf = require("csurf");

// Initiating the App Object from express
app = express();
app.disable("x-powered-by");

// Defining modules allowed to be used with App
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extende: true }));
app.use(cookieParser());
app.use(express.static(__dirname + "/assets"));

// Setting different options to be used within the App
app.set("view engine", "jade");
app.set("trust proxy", 1);

/* Configuring front-end and Backend Routes for the server
   * Front-end routes are mainly for express generated API Docs
   * Back-end routes are mainly for making API requests
  */

fs.readdir("routers", function(err, routes) {
  if (err) console.log("No router files found");
  console.log("Register routers");
  routes.forEach(function(file) {
    require("./routers/" + file);
  });
});

// End Of Configuring API Routers

server = require("http").createServer(app);
port = require("./port");
pjson = require("./package.json");
mongoose = require("mongoose");

mongoose.connect(
  "srvs:s1r2v3s@ds033973-a0.mongolab.com:33973/srvs,ds033973-a1.mongolab.com:33973/srvs?replicaSet=rs-ds033973"
);
mongoose.connection.on("connected", function() {
  console.log("Connected to MongoDB");
});
mongoose.connection.on("error", function() {
  console.log("Error Occured in Mongo Connection");
});
fs.readdir("models", function(err, models) {
  if (err) console.log("No model files found");
  console.log("Registering models now");
  models.forEach(function(file) {
    require("./models/" + file);
  });
});
server.listen(port, function() {
  console.log(
    "%s version %s running on port %d in %s mode",
    pjson.name,
    pjson.version,
    port,
    "Development"
  );
  console.log("Server's UID is now " + process.getuid());
});
module.exports = app;
