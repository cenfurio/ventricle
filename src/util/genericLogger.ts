import chalk from "chalk";
import graylog from 'gelf-pro';
import * as Sentry from '@sentry/node';
import {Envuments} from "envuments";

enum LoggerLevel {
    EMERGENCY,
    ALERT,
    CRITICAL,
    ERROR,
    WARNING,
    NOTICE,
    INFO,
    DEBUG,
    TRACE
}

graylog.setConfig({
    adapterName: 'udp',
    adapterOptions: {
        host: Envuments.get("GRAYLOG_HOST", "127.0.0.1"),
        port: Envuments.getNumber("GRAYLOG_PORT", 12201),
    },
    fields: {
        facility: "client", // TODO: Pkg data from somewhere
        version: "v0.0.0", // TODO: Pkg data from somewhere
        build: 'xxxxxxxx', // TODO: Pkg data from somewhere
    },
});

if (Envuments.get('SENTRY_DSN')) {
    Sentry.init({
        dsn: Envuments.get('SENTRY_DSN'),
        release: `v0.0.0` // TODO: Pkg data from somewhere
    });

    Sentry.configureScope(scope => {
        scope.setTag('build', 'xxxxxxxx'); // TODO: Pkg data from somewhere
    });
}

export class GenericLogger {
    constructor(private name: string) {}

    info(msg: any) {
        console.log(chalk.green(`[${this.timestamp()}]`), chalk.green(`[INFO] ${this.name} -`), chalk.dim(msg));
        this.gelf(LoggerLevel.INFO, msg);
    }

    debug(msg: any) {
        // TODO: Debug env
        console.log(chalk.cyan(`[${this.timestamp()}]`), chalk.cyan(`[DEBUG] ${this.name} -`), chalk.dim(msg));
        this.gelf(LoggerLevel.DEBUG, msg);
    }

    warn(msg: any) {
        console.log(chalk.yellow(`[${this.timestamp()}]`), chalk.yellow(`[WARN] ${this.name} -`), chalk.dim(msg));
        this.gelf(LoggerLevel.WARNING, msg);
    }

    error(msg: any) {
        console.log(chalk.red(`[${this.timestamp()}]`), chalk.red(`[ERROR] ${this.name} -`), chalk.dim(msg));

        const sentryEventId = Sentry.captureException(msg);

        this.gelf(LoggerLevel.ERROR, msg, {
            sentryEventId
        });

        return sentryEventId;
    }

    private timestamp() {
        return new Date().toISOString();
    }

    private gelf(level: LoggerLevel, msg: any, extra: {[key: string]: any} = {}) {
        graylog.message(msg, level, {
            name: this.name,

            levelName: LoggerLevel[level],
            ...extra
        });
    }
}
