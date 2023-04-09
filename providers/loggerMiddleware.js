const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.Console(),
    new transports.File({
        filename: 'logs/error.log',
        level: 'error',
        maxsize: 10 * 1024 * 1024,
        maxFiles: 99999,
        tailable: true
      }),
      new transports.File({
        filename: 'logs/combined.log',
        maxsize: 10 * 1024 * 1024,
        maxFiles: 99999,
        tailable: true
      })
  ]
});

function loggerMiddleware(req, res, next) {
  const start = Date.now();
  const { method, url } = req;

  res.on('finish', () => {
    const { statusCode } = res;
    const responseTime = Date.now() - start;
    logger.info(`${method} ${url} ${statusCode} ${responseTime}ms`);
  });

  next();
}

module.exports = loggerMiddleware;