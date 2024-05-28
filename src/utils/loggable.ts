import logger from "#utils/logger"

export default class Loggable {
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