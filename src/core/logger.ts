/**
 * @file logger of yuefu.
 * @author Yuyi Liang <liang.pearce@gmail.com>
 */

interface ILoggerOptions {
  error: boolean;
  warn: boolean;
  log: boolean;
  info: boolean;
  ns?: string; // namespace, log start by [:ns]
}
abstract class Logger {
  protected ns: string = 'default';
  protected showError: boolean = true;
  protected showWarn: boolean = true;
  protected showLog: boolean = true;
  protected showInfo: boolean = false;
  constructor(options: ILoggerOptions) {
    this.showError = options.error;
    this.showWarn = options.warn;
    this.showLog = options.log;
    this.showInfo = options.info;
    this.ns = options.ns;
  }

  public abstract error(...args: any[]): void;
  public abstract warn(...args: any[]): void;
  public abstract log(...args: any[]): void;
  public abstract info(...args: any[]): void;
}

class ConsoleLogger extends Logger {
  constructor(options: ILoggerOptions) {
    super(options);
  }
  public error(...args: any[]): void {
    if (!this.showError) {
      return;
    }
    console.error(`[${this.ns}]`, ...args);
  }
  public warn(...args: any[]): void {
    if (!this.showWarn) {
      return;
    }
    console.warn(`[${this.ns}]`, ...args);
  }
  public log(...args: any[]): void {
    if (!this.showLog) {
      return;
    }
    console.log(`[${this.ns}]`, ...args);
  }
  public info(...args: any[]): void {
    if (!this.showInfo) {
      return;
    }
    console.info(`[${this.ns}]`, ...args);
  }
}

export {
  Logger,
  ConsoleLogger,
};
