import chalk from "chalk";

// TODO: Convert into LoggerService
export class Logger {
    private readonly formattedName: string;

    constructor(private name: string, private id?: string) {
        this.formattedName = id ? `${name}[${id}]` : name;
    }

    log(message: any) {
        console.log(chalk.green(`[${this.timestamp()}]`), chalk.green(`[INFO] ${this.formattedName} -`), chalk.dim(message));
    }

    debug(message: any) {
        // TODO: Debug env
        console.log(chalk.cyan(`[${this.timestamp()}]`), chalk.cyan(`[DEBUG] ${this.formattedName} -`), chalk.dim(message));
    }

    warn(message: any) {
        console.log(chalk.yellow(`[${this.timestamp()}]`), chalk.yellow(`[WARN] ${this.formattedName} -`), chalk.dim(message));
    }

    error(message: any) {
        console.log(chalk.red(`[${this.timestamp()}]`), chalk.red(`[ERROR] ${this.formattedName} -`), chalk.dim(message));
    }

    private timestamp() {
        return new Date().toISOString();
    }
}