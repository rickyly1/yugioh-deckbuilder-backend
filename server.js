// Dependency imports
require("dotenv").config();
const express = require("express");
const app = express();

// Local controller imports
const { logger } = require("./utils/logger");
const cors = require("cors");
/*
    project controllers/routers
**/

// Server port setup
const PORT = process.env.PORT || 4000;
app.use(express.json());

function loggerMiddleware(req, res, next) {
    logger.info(`Incoming ${req.method} : ${req.url}`);
    next();
}

app.use(loggerMiddleware);
app.use(cors());

// Routing setup
/**
 * project api endpoints
 */

// Port listen
app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
})