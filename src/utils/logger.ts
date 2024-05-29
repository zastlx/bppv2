class Logger {
    info(prefix: string, message: string): void {
        console.log(`${prefix} ${message}`);
    }

    error(prefix: string, message: string): void {
        console.error(`${prefix} ${message}`);
    }

    warn(prefix: string, message: string): void {
        console.warn(`${prefix} ${message}`);
    }
}

const logger = new Logger();

class Loggable {
    private prefix: string;

    constructor(prefix: string) {
        this.prefix = prefix;
    }

    log(message: string): void {
        logger.info(this.prefix, message);
    }

    error(message: string): void {
        logger.error(this.prefix, message);
    }

    warn(message: string): void {
        logger.warn(this.prefix, message);
    }
}

export default logger;
export {
    Loggable,
    Logger
};