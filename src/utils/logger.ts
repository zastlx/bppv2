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

export default new Logger();
