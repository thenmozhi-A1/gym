import log from 'loglevel';

// Set the logger level based on environment
// In development it shows everything (trace, debug, info, warn, error)
// In production it is set to "silent" (or "error" if we only want critical errors, but user requested silenced)
const env = import.meta.env.MODE || process.env.NODE_ENV;

if (env === 'production') {
  log.setLevel('silent');
} else {
  log.setLevel('debug');
}

export default log;
