export interface ILogger {
    trace(message: string, ...data: Array<any>);
    debug(message: string, ...data: Array<any>);
    info(message: string, ...data: Array<any>);
    warning(message: string, ...data: Array<any>);
    error(message: string, ...data: Array<any>);
}

export enum LogLevel {
    TRACE = 1,
    DEBUG,
    INFO,
    WARNING,
    ERROR
}
