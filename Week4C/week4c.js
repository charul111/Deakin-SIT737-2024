const express = require("express");
const app = express();
const winston = require('winston');

// Configure Winston logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'calculator-microservice' },
    transports: [
        // Log to console
        new winston.transports.Console({
            format: winston.format.simple()
        }),
        // Log errors to error.log file
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        // Log all messages (except errors) to combined.log file
        new winston.transports.File({ filename: 'logs/combined.log' })
    ]
});

// Define arithmetic operations
const operations = {
    add: (n1, n2) => n1 + n2,
    subtract: (n1, n2) => n1 - n2,
    multiply: (n1, n2) => n1 * n2,
    divide: (n1, n2) => n1 / n2,
    exponentiate: (n1, n2) => Math.pow(n1, n2),
    squareRoot: (n) => Math.sqrt(n),
    modulo: (n1, n2) => n1 % n2
};

// API endpoint for arithmetic operations
app.get("/calculate", (req, res) => {
    try {
        const { operation, n1, n2 } = req.query;

        // Check if requested operation is valid
        if (!operations[operation]) {
            logger.error("Invalid operation requested");
            throw new Error("Invalid operation requested");
        }

        let result;
        // Handle squareRoot operation separately as it's a unary operation
        if (operation === "squareRoot") {
            const parsedN1 = parseFloat(n1);
            // Check if the operand for squareRoot is valid
            if (isNaN(parsedN1)) {
                logger.error("Invalid parameter provided for squareRoot operation");
                throw new Error("Invalid parameter provided for squareRoot operation");
            }
            // Calculate square root
            result = operations[operation](parsedN1);
        } else {
            const parsedN1 = parseFloat(n1);
            const parsedN2 = parseFloat(n2);

            // Check if the operands are valid numbers
            if (isNaN(parsedN1) || isNaN(parsedN2)) {
                logger.error("Invalid parameters provided");
                throw new Error("Invalid parameters provided");
            }

            // Perform the requested binary operation
            result = operations[operation](parsedN1, parsedN2);
        }

        // Log the operation and operands
        logger.info(`Performing ${operation} operation with ${n1} and ${n2}`);
        // Send response with result
        res.status(200).json({ statusCode: 200, result });
    } catch (error) {
        // Log and handle errors
        logger.error(error.toString());
        res.status(500).json({ statusCode: 500, msg: error.toString() });
    }
});

// Start the server
const port = 3040;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
