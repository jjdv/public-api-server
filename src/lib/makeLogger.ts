import log4js from 'log4js';

const defaultLogLevel = process.env.LOG_LEVEL || 'info';

log4js.configure({
  appenders: {
    out: { type: 'stdout' },
  },
  categories: {
    default: { appenders: ['out'], level: defaultLogLevel },
  },
});

export interface LoggerConfig {
  name: string;
  logLevel: string;
}

export default function makeLogger(config?: string | LoggerConfig) {
  if (typeof config === 'undefined' || typeof config === 'string')
    return log4js.getLogger(config);

  const { name, logLevel } = config;
  const logger = log4js.getLogger(name);
  if (logLevel) logger.level = logLevel;

  return logger;
}
