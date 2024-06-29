//dependencies
const express = require("express");
const helmet = require("helmet");
const dotenv = require("dotenv");
const { StatusCodes } = require("http-status-codes");
const cors = require("cors");
const defineGlobalErrorHandler = require("./middlewares/defineGlobalErrorHandler");
const notFoundHandler = require("./middlewares/notFoundHandler");
const defineMetrics = require("./libraries/utils/defineMetrics");
const logger = require("./libraries/logger/LoggerManager");
const requestLogger = require("./middlewares/requestLogger");
const authenticationHandler = require("./middlewares/authenticationHandler");
const admin = require("firebase-admin");
const cocktailsRoutes = require("./routes/cocktailsRoutes");
const personsRoutes = require("./routes/personsRoutes");
const bodyParser = require("body-parser");

const initializeApp = (expressApp) => {
  logger.info("Initializing app...");
  dotenv.config();

  //firebase
  const serviceAccount = require("./firebase_service_key.json");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  //enable middlewares
  expressApp.use(cors());
  expressApp.use(helmet());
  expressApp.use(express.urlencoded({ extended: true }));
  expressApp.use(express.json());
  expressApp.use(bodyParser.text({ type: "text/plain" }));
  expressApp.use(requestLogger);

  defineMetrics(expressApp);

  //health check route
  expressApp.get("/health", (req, res) => {
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Server is healthy",
    });
  });

  // expressApp.all("*", authenticationHandler);

  expressApp.use("/cocktails", cocktailsRoutes);
  expressApp.use("/persons", personsRoutes);

  expressApp.all("*", notFoundHandler);
  defineGlobalErrorHandler(expressApp);
};

module.exports = initializeApp;
