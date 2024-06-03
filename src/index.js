const logger = require('./libraries/logger/LoggerManager');
const { startServer } = require('./server');

const start = async () => {
  await startServer();
};

start()
  .then(() => {
    logger.info(`Server is successfully live`);
  })
  .catch((error) => {
    logger.error(error);
  });
