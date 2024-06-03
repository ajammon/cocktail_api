const promClient = require('prom-client');
const responseTime = require('response-time');
const logger = require('../logger/LoggerManager');

// Define a histogram metric for response time

const defineMetrics = async (expressApp) => {
  //collect Default Metrics
  promClient.collectDefaultMetrics();

  //define custom metrics
  const responseTimeHistogram = new promClient.Histogram({
    name: 'http_response_duration_seconds',
    help: 'HTTP response duration in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [
      0.1, 0.5, 1, 2, 3, 4, 5, 6, 8, 10, 15, 20, 30, 40, 50, 60, 80, 100, 150,
      200, 300, 500, 1000,
    ],
  });

  // Define a counter metric for throughput
  const requestCounter = new promClient.Counter({
    name: 'total_http_requests',
    help: 'Total number of HTTP requests processed',
    labelNames: ['route'],
  });

  const errorCounter = new promClient.Counter({
    name: 'total_http_errors',
    help: 'Total number of errors',
  });

  // Middleware to measure response time
  expressApp.use(
    responseTime((req, res, time) => {
      if (res.statusCode >= 400) {
        errorCounter.inc();
      }
      requestCounter.inc({ route: req.url });
      responseTimeHistogram
        .labels({
          method: req.method,
          route: req.url,
          status_code: res.statusCode,
        })
        .observe(time);
    })
  );

  // Expose metrics endpoint
  expressApp.get('/metrics', async (req, res) => {
    try {
      res.setHeader('Content-Type', promClient.register.contentType);
      const metrics = await promClient.register.metrics();
      res.send(metrics);
    } catch (error) {
      logger.error('Error fetching metrics:', error);
      res.status(500).send('Error fetching metrics');
    }
  });
};

module.exports = defineMetrics;
