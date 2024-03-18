// Import the Express framework
const express = require("express");

// Create an instance of Express
const app = express();

// Function to add two numbers
const addTwoNumber = (n1, n2) => {
    return n1 + n2;
};

// Endpoint to add two numbers
app.get("/addTwoNumber", (req, res) => {
    // Parse the query parameters as integers
    const n1 = parseInt(req.query.n1);
    const n2 = parseInt(req.query.n2);

    // Calculate the result by calling the addTwoNumber function
    const result = addTwoNumber(n1, n2);

    // Send the result as JSON
    res.json({ statusCode: 200, data: result });
});

// Default endpoint returns an HTML response
app.get("/", (req, res) => {
    // Define HTML content
    const htmlContent = "<html><body><H1>HELLO THERE</H1></body></html>";

    // Set the response content type as HTML
    res.set('Content-Type', 'text/html');

    // Send the HTML content as response
    res.send(Buffer.from(htmlContent));
});

// Log the result of adding two numbers
console.log(addTwoNumber(19, 12));

// Define the port number
const port = 3040;

// Start the server and listen on the defined port
app.listen(port, () => {
    console.log("Server is listening on port " + port);
});
