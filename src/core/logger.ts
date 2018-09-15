/**
 * @file logger of yuefu.
 * @author Yuyi Liang <liang.pearce@gmail.com>
 */

const levels: string[] = ['error', 'warn', 'log', 'info'];
let level: string = 'warn';

function debug(method, ...args) {
  if (levels.indexOf(method) <= levels.indexOf(level)) {
    console[method](...args);  // eslint-disable-line no-console
  }
}

function namespace(ns) {
  return levels.reduce(function(logger, method) {
    logger[method] = debug.bind(console, method, ns);
    return logger;
  },                   {});
}

debug.level = namespace.level = (newLevel: string) => {
  level = newLevel;
};

class Logger {
  constructor() {

  }
}

export {
  namespace,
  debug
};
