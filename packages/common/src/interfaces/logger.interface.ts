export interface ILogger {
    log(message: string, ...args: any[]);
    warn(message: string, ...args: any[]);
    debug(message: string, ...args: any[]);
    error(message: string, ...args: any[]);
}