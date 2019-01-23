var express = require("express");
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.json());
global.__basedir = __dirname;

const cors = require("cors");
const corsOptions = {
  //origin: "http://67.205.185.159:4300",
  origin: "*",	
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

require("./app/router/routes.js")(app);

// Create a Server
var server = app.listen(8081, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log("App listening at http://%s:%s", host, port);
});
