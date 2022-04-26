/* istanbul ignore file */
import makeLogger from './lib/makeLogger';
import app from './app';

const serverLogger = makeLogger('Server');

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  serverLogger.info(`Apo server is listening at http://localhost:${port}`);
});

function shutDown(signal: string) {
  serverLogger.info(`Signal "${signal}" received. Closing Server ...`);
  server.close(() => {
    serverLogger.info('Server closed.');
  });
}

process.on('SIGTERM', () => shutDown('SIGTERM'));
process.on('SIGINT', () => shutDown('SIGINT'));
