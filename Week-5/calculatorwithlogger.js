// Import required modules
const express = require("express");
const winston = require('winston');

// Create Express app
const app = express();

// Configure Winston logger
const logger = winston.createLogger({
    level: 'info', // Log level set to 'info'
    format: winston.format.json(), // JSON format for logs
    defaultMeta: { service: 'calculate-service' }, // Default metadata for logs
    transports: [
        new winston.transports.Console({format: winston.format.simple(),}), // Console transport for logging to console
        new winston.transports.File({ filename: 'error.log', level: 'error' }), // File transport for error logs
        new winston.transports.File({ filename: 'combined.log' }), // File transport for all logs
    ],
});

// Add console logger if not in production environment
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

// Define operations object with arithmetic functions
const operations = {
    add: (n1, n2) => n1 + n2, // Addition function
    subtract: (n1, n2) => n1 - n2, // Subtraction function
    multiply: (n1, n2) => n1 * n2, // Multiplication function
    divide: (n1, n2) => n1 / n2, // Division function
};

// Endpoint to perform calculations
app.get("/calculate", (req, res) => {
    try {
        // Extract operation and operands from query parameters
        const { operation, n1, n2 } = req.query;
        const parsedN1 = parseFloat(n1); // Parse first operand to float
        const parsedN2 = parseFloat(n2); // Parse second operand to float

        // Check if operands are valid numbers
        if (isNaN(parsedN1) || isNaN(parsedN2)) {
            logger.error("Invalid parameters provided");
            throw new Error("Invalid parameters provided");
        }

        // Check if requested operation is supported
        if (!operations[operation]) {
            logger.error("Invalid operation requested");
            throw new Error("Invalid operation requested");
        }

        // Log the operation being performed
        logger.info(`Performing ${operation} operation with ${parsedN1} and ${parsedN2}`);
        
        // Perform the requested operation
        const result = operations[operation](parsedN1, parsedN2);
        
        // Send the result as JSON response
        res.status(200).json({ statusCode: 200, result });
    } catch (error) {
        // Log and handle any errors that occur during calculation
        logger.error(error.toString());
        res.status(500).json({ statusCode: 500, msg: error.toString() });
    }
});

// Set the port for the server to listen on
const port = 3040;
// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
