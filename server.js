"use strict";

require("coffee-script/register");
require("express-namespace");
const express = require("express");

const bodyParser = require("body-parser");
const fs = require("fs");
// docs = require("express-mongoose-docs")
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const errorHandler = require("errorhandler");
const helmet = require("helmet");
const csrf = require("csurf");

// Initiating the App Object from express
const app = express();
app.disable("x-powered-by");

// Defining modules allowed to be used with App
app.use(bodyParser.json());
app.use(methodOverride());
app.use(errorHandler());
app.use(helmet());
app.use(csrf());
app.use(bodyParser.urlencoded({ extende: true }));
app.use(cookieParser());
app.use(express.static(`${__dirname}/assets`));

// Setting different options to be used within the App
app.set("view engine", "jade");
app.set("trust proxy", 1);

/* Configuring front-end and Backend Routes for the server
   * Front-end routes are mainly for express generated API Docs
   * Back-end routes are mainly for making API requests
  */

fs.readdir("routers", (err, routes) => {
  if (err) console.log("No router files found");
  console.log("Register routers");
  routes.forEach(file => {
    require(`./routers/${file}`); // eslint-disable-line global-require
  });
});

// End Of Configuring API Routers

const server = require("http").createServer(app);
const port = require("./port");
const pjson = require("./package.json");
const mongoose = require("mongoose");

mongoose.connect(
  "srvs:s1r2v3s@ds033973-a0.mongolab.com:33973/srvs,ds033973-a1.mongolab.com:33973/srvs?replicaSet=rs-ds033973"
);
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});
mongoose.connection.on("error", () => {
  console.log("Error Occured in Mongo Connection");
});
fs.readdir("models", (err, models) => {
  if (err) console.log("No model files found");
  console.log("Registering models now");
  models.forEach(file => {
    require(`./models/${file}`); // eslint-disable-line global-require
  });
});
server.listen(port, () => {
  console.log(
    "%s version %s running on port %d in %s mode",
    pjson.name,
    pjson.version,
    port,
    "Development"
  );
  console.log(`Server's UID is now ${process.getuid()}`);
});
module.exports = app;
