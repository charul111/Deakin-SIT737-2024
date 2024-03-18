// Require the Express framework
var express = require("express");

// Create an instance of Express
var app = express();

// Define the port to listen on, defaulting to port 3000 if not provided through environment variables
var port = process.env.PORT || 3000;

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log("App listening on port: " + port);
});
