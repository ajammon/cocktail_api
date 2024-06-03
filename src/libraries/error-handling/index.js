const { StatusCodes } = require('http-status-codes');
const util = require('util');
const AppError = require('./AppError');
const logger = require('../logger/LoggerManager');

let httpServerRef;

const errorHandler = {
  listenToErrorEvents: (httpServer) => {
    httpServerRef = httpServer;

    process.on('uncaughtException', async (error) => {
      console.log(error);
      await errorHandler.handleError(error);
    });

    process.on('unhandledRejection', async (reason) => {
      await errorHandler.handleError(reason);
    });

    process.on('SIGTERM', async () => {
      await terminateServer();
    });

    process.on('SIGINT', async () => {
      await terminateServer();
    });
  },

  handleError: async (error) => {
    try {
      const appError = normalizeError(error);
      if (!appError.operational) {
        await terminateServer();
      }
    } catch (handlingError) {
      // No logger here since it might have failed
      process.stdout.write(
        'The error handler failed. Here are the handler failure and then the origin error that it tried to handle: '
      );
      process.stdout.write(JSON.stringify(handlingError));
      process.stdout.write(JSON.stringify(error));
    }
  },
};

const terminateServer = async () => {
  logger.warn('Server is gracefully shutting down...');
  if (httpServerRef) {
    await new Promise((resolve) => httpServerRef.close(resolve)); // Graceful shutdown
  }
  process.exit();
};

const normalizeError = (error) => {
  if (error instanceof AppError) {
    return error;
  }
  if (error instanceof Error) {
    const appError = new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      error.message
    );
    appError.stack = error.stack;
    return appError;
  }

  const inputType = typeof error;
  return new AppError(
    StatusCodes.INTERNAL_SERVER_ERROR,
    `Error Handler received a none error instance with type - ${inputType}, value - ${util.inspect(
      error
    )}`
  );
};

module.exports = errorHandler;
