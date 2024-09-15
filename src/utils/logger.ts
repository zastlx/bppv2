// stolen from https://github.com/Vendicated/Vencord/blob/e9e789be7093e8b025f606cde69b3d89760c9380/src/utils/Logger.ts#L19
export class Logger {
    static makeTitle(color: string, title: string): [string, ...string[]] {
        return ["%c %c %s ", "", `background: ${color}; color: black; font-weight: bold; border-radius: 5px;`, title];
    }

    constructor(public _name: string, public color: string = "white") { }

    private _log(level: "error" | "warn" | "info", levelColor: string, args: any[]) {
        console[level](
            `%c BPP %c %c ${this._name}`,
            `background: ${levelColor}; color: black; font-weight: bold; border-radius: 5px;`,
            "",
            `background: ${this.color}; color: black; font-weight: bold; border-radius: 5px;`
            , ...args
        );
    }

    protected info(...args: any[]) {
        this._log("info", "#a6d189", args);
    }

    protected error(...args: any[]) {
        this._log("error", "#e78284", args);
    }

    protected warn(...args: any[]) {
        this._log("warn", "#e5c890", args);
    }
}


export default Logger;