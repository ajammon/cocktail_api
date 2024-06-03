const { StatusCodes } = require('http-status-codes');
const AppError = require('../libraries/error-handling/AppError');

const notFoundHandler = (req, res, next) => {
  next(
    new AppError(
      StatusCodes.NOT_FOUND,
      `Can't find your requested url: '${req.originalUrl}' in the server`
    )
  );
};

module.exports = notFoundHandler;
