import chalk from "chalk";

// TODO: Convert into LoggerService
export class Logger {
    private readonly formattedName: string;

    constructor(private name: string, private id?: string) {
        this.formattedName = id ? `${name}[${id}]` : name;
    }

    log(message: any, ...messages: any[]) {
        console.log(chalk.green(`[${this.timestamp()}]`), chalk.green(`[INFO] ${this.formattedName} -`), chalk.dim(message), messages.map(msg => chalk.dim(msg)));
    }

    debug(message: any, ...messages: any[]) {
        // TODO: Debug env
        console.log(chalk.cyan(`[${this.timestamp()}]`), chalk.cyan(`[DEBUG] ${this.formattedName} -`), chalk.dim(message), messages.map(msg => chalk.dim(msg)));
    }

    warn(message: any, ...messages: any[]) {
        console.log(chalk.yellow(`[${this.timestamp()}]`), chalk.yellow(`[WARN] ${this.formattedName} -`), chalk.dim(message), messages.map(msg => chalk.dim(msg)));
    }

    error(message: any, ...messages: any[]) {
        console.log(chalk.red(`[${this.timestamp()}]`), chalk.red(`[ERROR] ${this.formattedName} -`), chalk.dim(message), messages.map(msg => chalk.dim(msg)));
    }

    private timestamp() {
        return new Date().toISOString();
    }
}